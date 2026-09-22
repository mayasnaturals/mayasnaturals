import React from 'react';
import styles from './RatingSummary.module.css';
import { Star } from 'lucide-react';

export default function RatingSummary({ averageRating, totalReviews, breakdown }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Customer Reviews</h2>
        <div className={styles.averageContainer}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={star <= Math.round(averageRating) ? styles.starFilled : styles.starEmpty}
              />
            ))}
          </div>
          <span className={styles.averageText}>{averageRating} out of 5</span>
        </div>
        <p className={styles.totalReviews}>{totalReviews} global ratings</p>
      </div>

      <div className={styles.barsContainer}>
        {breakdown.map((row) => (
          <div key={row.stars} className={styles.row}>
            <span className={styles.starLabel}>{row.stars} star</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${row.percentage}%` }}
              ></div>
            </div>
            <span className={styles.percentageLabel}>{row.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
