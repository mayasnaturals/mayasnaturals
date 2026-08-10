import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";

const GET_DISCOUNTS_QUERY = `
  query getDiscounts {
    codeDiscountNodes(first: 50) {
      edges {
        node {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              summary
              status
              codes(first: 10) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
            ... on DiscountCodeFreeShipping {
              title
              summary
              status
              codes(first: 10) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Aggregate local DB coupon usage to see who used what
    const localUsage = await Order.aggregate([
      { $unwind: "$couponsUsed" },
      {
        $group: {
          _id: { $toLower: "$couponsUsed" },
          users: { 
            $push: { 
              name: { $concat: ["$customerData.firstName", " ", "$customerData.lastName"] },
              email: "$customerData.email",
              orderId: "$_id",
              date: "$createdAt"
            } 
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const usageMap = {};
    localUsage.forEach(item => {
      usageMap[item._id] = { users: item.users, count: item.count };
    });

    // 2. Fetch coupons from Shopify Admin GraphQL API
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = await getShopifyAdminToken();

    let shopifyCoupons = [];
    if (adminToken && domain) {
      const shopifyRes = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query: GET_DISCOUNTS_QUERY }),
      });

      if (shopifyRes.ok) {
        const data = await shopifyRes.json();
        const nodes = data?.data?.codeDiscountNodes?.edges || [];
        
        shopifyCoupons = nodes.map(edge => {
          const discount = edge.node.codeDiscount;
          const codes = discount?.codes?.edges?.map(c => c.node.code) || [];
          const mainCode = codes[0] || discount?.title || "UNKNOWN";
          const lowerCode = mainCode.toLowerCase();
          
          return {
            id: edge.node.id,
            title: discount?.title,
            summary: discount?.summary,
            status: discount?.status,
            code: mainCode,
            usageCount: usageMap[lowerCode]?.count || 0,
            usedBy: usageMap[lowerCode]?.users || []
          };
        });
      } else {
        console.error("Failed to fetch Shopify coupons:", await shopifyRes.text());
      }
    }

    // Merge in any coupons used locally that weren't returned by Shopify (e.g., deleted or past 50 limit)
    const existingShopifyCodes = new Set(shopifyCoupons.map(c => c.code.toLowerCase()));
    localUsage.forEach(item => {
      if (!existingShopifyCodes.has(item._id)) {
        shopifyCoupons.push({
          id: `local_${item._id}`,
          title: item._id.toUpperCase(),
          summary: "Local DB only (not found in first 50 Shopify)",
          status: "UNKNOWN",
          code: item._id.toUpperCase(),
          usageCount: item.count,
          usedBy: item.users
        });
      }
    });
    
    // Sort by usage count descending
    shopifyCoupons.sort((a, b) => b.usageCount - a.usageCount);

    return NextResponse.json({ success: true, coupons: shopifyCoupons });
  } catch (error) {
    console.error("Admin coupons fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
