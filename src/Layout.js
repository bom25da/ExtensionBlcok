import Header from "./Header"
import Footer from "./Footer"
import styles from "./Layout.module.css"

const Layout = ({children}) => {
    return(
        <div className={styles.layout}>
            <Header />

            <main>
                {children}
            </main>

            <Footer />
        </div>
    )
}

export default Layout