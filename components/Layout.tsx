// components/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-6">
                    {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;


