export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          badge: metafield(namespace: "custom", key: "badge") {
            value
          }
          newness: metafield(namespace: "custom", key: "newness") {
            value
          }
          colorDark: metafield(namespace: "custom", key: "color_dark") {
            value
          }
          colorMid: metafield(namespace: "custom", key: "color_mid") {
            value
          }
          colorLight: metafield(namespace: "custom", key: "color_light") {
            value
          }
          variants(first: 1) {
            edges {
              node {
                id
                weight
                weightUnit
              }
            }
          }
        }
      }
    }
  }
`;

const metafieldFragment = `
  fragment MetafieldFragment on Metafield {
    value
    reference {
      ... on Metaobject {
        handle
        fields {
          key
          value
        }
      }
    }
    references(first: 10) {
      edges {
        node {
          ... on Metaobject {
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = `
  ${metafieldFragment}
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      badge: metafield(namespace: "custom", key: "badge") {
        value
      }
      newness: metafield(namespace: "custom", key: "newness") {
        value
      }
      colorDark: metafield(namespace: "custom", key: "color_dark") {
        value
      }
      colorMid: metafield(namespace: "custom", key: "color_mid") {
        value
      }
      colorLight: metafield(namespace: "custom", key: "color_light") {
        value
      }
      options {
        name
        values
      }
      allergenCustom: metafield(namespace: "custom", key: "allergen_information") { ...MetafieldFragment }
      dietaryCustom: metafield(namespace: "custom", key: "dietary_preferences") { ...MetafieldFragment }
      flavorCustom: metafield(namespace: "custom", key: "flavor") { ...MetafieldFragment }
      formCustom: metafield(namespace: "custom", key: "food_product_form") { ...MetafieldFragment }
      allergenShopify: metafield(namespace: "shopify", key: "allergen_information") { ...MetafieldFragment }
      dietaryShopify: metafield(namespace: "shopify", key: "dietary_preferences") { ...MetafieldFragment }
      flavorShopify: metafield(namespace: "shopify", key: "flavor") { ...MetafieldFragment }
      formShopify: metafield(namespace: "shopify", key: "food_product_form") { ...MetafieldFragment }
      allergenShopify2: metafield(namespace: "shopify", key: "allergens") { ...MetafieldFragment }
      dietaryShopify2: metafield(namespace: "shopify", key: "dietary-preferences") { ...MetafieldFragment }
      flavorShopify2: metafield(namespace: "shopify", key: "flavor-profile") { ...MetafieldFragment }
      formShopify2: metafield(namespace: "shopify", key: "form") { ...MetafieldFragment }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            weight
            weightUnit
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const getCartQuery = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
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

export const getCustomerQuery = `
  query getCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      orders(first: 10) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;
