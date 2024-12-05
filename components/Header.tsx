"use client";

// components/Header.tsx
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { Button } from "@/components/ui/button";

const Header = () => {
  const pathname = usePathname(); // Get the current path

  // Function to check if the link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header style={{ backgroundColor: '#1a202c', padding: '10px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#ffffff', fontSize: '24px' }}>Mechanics Portal</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button
            asChild
            variant={isActive("/") ? "solid" : "link"} // Highlight the active link
            color={isActive("/") ? "green" : "white"} // Optional: Change color for active link
            style={{ padding: '8px 16px' }}
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/dashboard/employees") ? "solid" : "link"}
            color={isActive("/dashboard/employees") ? "green" : "white"}
            style={{ padding: '8px 16px' }}
          >
            <Link href="/dashboard/employees">Employees</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/dashboard/worksorders") ? "solid" : "link"}
            color={isActive("/dashboard/worksorders") ? "green" : "white"}
            style={{ padding: '8px 16px' }}
          >
            <Link href="/dashboard/worksorders">Worksorders</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
