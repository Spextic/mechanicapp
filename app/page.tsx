// pages/index.tsx
import React from 'react';
import Layout from '@/components/Layout';
import Discord from 'next-auth/providers/discord';


const HomePage = () => {
  return (
    <Layout>
      <h1>Welcome to the Home Page</h1>
      <p>This is the content of the homepage.</p>
    </Layout>
  );
};

export default HomePage;
