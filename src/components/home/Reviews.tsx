import styles from './Reviews.module.css';

export default function Reviews() {
    const reviews = [
        {
            name: "Suresh Kumar",
            rating: 5,
            date: "October 14, 2023",
            text: "Excellent service and genuine products. Bought a Daikin AC and the installation was very smooth. Highly recommended!",
            initial: "S"
        },
        {
            name: "Monica Reddy",
            rating: 5,
            date: "January 02, 2024",
            text: "Best electronics shop in Secunderabad. Prices are very competitive compared to online stores. Staff is very helpful.",
            initial: "M"
        },
        {
            name: "Rahul Sharma",
            rating: 4,
            date: "February 28, 2024",
            text: "Good collection of TVs. Got a good deal on Samsung Crystal 4K. Delivery was on time.",
            initial: "R"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <h2 className={styles.title}>What Our Customers Say</h2>
                
                {/* Verified Google Business Badge */}
                <a href="https://www.google.com/search?q=Raj+Electronics+secunderabad#lrd=0x3bcb977ab7519965:0xb9f9c063b4f62fd5,1" target="_blank" rel="noopener noreferrer" className={styles.googleBadgeLink}>
                    <div className={styles.googleBadge}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className={styles.gLogo} width={24} height={24} />
                        <div>
                            <div className={styles.gScale}><strong>4.9 / 5.0</strong> Rating</div>
                            <div className={styles.gVerified}>✔ Verified Google Business Listing</div>
                        </div>
                    </div>
                </a>

                <div className={styles.grid}>
                    {reviews.map((review, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.header}>
                                <div className={styles.avatar}>{review.initial}</div>
                                <div>
                                    <div className={styles.name}>{review.name}</div>
                                    <div className={styles.meta}>
                                        <span className={styles.stars}>{"★".repeat(review.rating)}</span>
                                        <span className={styles.date}>{review.date}</span>
                                    </div>
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width={18} height={18} alt="" style={{opacity: 0.8}} />
                                </div>
                            </div>
                            <p className={styles.text}>{review.text}</p>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <a href="https://www.google.com/search?q=Raj+Electronics+secunderabad#lrd=0x3bcb977ab7519965:0xb9f9c063b4f62fd5,1" target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Read all 105+ reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
