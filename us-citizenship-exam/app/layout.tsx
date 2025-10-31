import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Naturalization Practice Hub',
	description: 'Practice for the U.S. naturalization test'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return children;
}
