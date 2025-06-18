import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';

const page = () => {
  return (
    <div className={styles.page} style={{ color: "white", textAlign: "center" }}>
      <h1 className={styles.heading}>Quiz</h1>
      <p className={styles.description}>
        Test your knowledge with our quizzes! Click on the cards below to start.
        </p>
        <div className={styles.gamesContainer}>
          <div className={styles.quizCard}>
            <div className={styles.quizContainer}>
              <Link href='/quiz/gthc' className={styles.quizLink}>
                <Image
                src={"/backgrounds/gthc.png"}
                fill
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    overflow: "hidden",
                    borderRadius: "0px",
                    filter: "blur(15px)",
                }}
                alt='Quiz Background'
                />
                <Image
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    overflow: "hidden",
                    borderRadius: "10px",
                }}
                src={"/backgrounds/gthc-V3.png"}
                fill
                alt='Quiz Background'
                />
              </Link>
            </div>
            <div className={styles.quizContainer}>
                <Image
                src={"/backgrounds/bg-quiz.png"}
                fill
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    overflow: "hidden",
                    borderRadius: "0px",
                    filter: "blur(15px)",
                }}
                alt='Quiz Background'
                />
                <Image
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    overflow: "hidden",
                    borderRadius: "10px",
                }}
                src={"/backgrounds/bg-quiz-V2.png"}
                fill
                alt='Quiz Background'
                />
            </div>
          </div>
      </div>
    </div>
  );
}

export default page;