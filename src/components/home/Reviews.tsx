import styles from './Reviews.module.css';

export default function Reviews() {
    const reviews = [
        {
            name: "Suresh Kumar",
            rating: 5,
            date: "2 months ago",
            text: "Excellent service and genuine products. Bought a Daikin AC and the installation was very smooth. Highly recommended!",
            initial: "S"
        },
        {
            name: "Monica Reddy",
            rating: 5,
            date: "1 month ago",
            text: "Best electronics shop in Secunderabad. Prices are very competitive compared to online stores. Staff is very helpful.",
            initial: "M"
        },
        {
            name: "Rahul Sharma",
            rating: 4,
            date: "3 weeks ago",
            text: "Good collection of TVs. Got a good deal on Samsung Crystal 4K. Delivery was on time.",
            initial: "R"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <h2 className={styles.title}>What Our Customers Say</h2>
                <div className={styles.googleBadge}>
                    <span className={styles.gScale}>4.9/5</span> on Google Reviews
                </div>

                <div className={styles.grid}>
                    {reviews.map((review, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.header}>
                                <div className={styles.avatar}>{review.initial}</div>
                                <div>
                                    <div className={styles.name}>{review.name}</div>
                                    <div className={styles.meta}>
                                        <span className={styles.stars}>{"★".repeat(review.rating)}</span>
                                        {/* Date removed as per request */}
                                    </div>
                                </div>
                            </div>
                            <p className={styles.text}>{review.text}</p>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <a href="https://maps.google.com/?q=Raj+Electronics+Secunderabad" target="_blank" className={styles.link}>
                        Read all 85+ reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
