import "./globals.css";

export const metadata = {
	title: "BE STRONG FITNESS STUDIO | Master Your Body",
	description:
		"BE STRONG FITNESS STUDIO. Cinematic gym experience. Start your fitness journey today.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	);
}
