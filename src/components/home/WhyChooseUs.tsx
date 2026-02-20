import styles from './WhyChooseUs.module.css';

export default function WhyChooseUs() {
    const features = [
        { title: 'Best Prices', desc: 'Guaranteed lowest prices in Secunderabad on all electronics.', icon: '💰' },
        { title: 'Genuine Products', desc: '100% authentic products with manufacturer warranty.', icon: '✨' },
        { title: 'Expert Advice', desc: 'Our team helps you choose the perfect product for your needs.', icon: '👨‍💼' },
        { title: 'After Sales Support', desc: 'We are here to help even after your purchase is complete.', icon: '🛠️' },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Why Choose Raj Electronics?</h2>
                <div className={styles.grid}>
                    {features.map((feature, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
