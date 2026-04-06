import "./globals.css";
import SiteNavbar from "./components/navigation/site-navbar";

export const metadata = {
	title: "BE STRONG FITNESS STUDIO | Master Your Body",
	description:
		"BE STRONG FITNESS STUDIO. Cinematic gym experience. Start your fitness journey today.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<SiteNavbar />
				{children}
			</body>
		</html>
	);
}
