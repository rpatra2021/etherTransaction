import React from "react";
import './footer.css';

const Footer = () => {
    return (
        <footer>
            Application Footer, copyright { new Date().getFullYear() } - { new Date().getFullYear() + 1 } @ Rahul Patra 
        </footer>
    )
}
export default Footer