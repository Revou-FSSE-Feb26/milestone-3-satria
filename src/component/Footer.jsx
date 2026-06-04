import XIcon from "../../public/icons/x-twitter.svg"
import InstagramIcon from "../../public/icons/instagram.svg"
import FacebookIcon from "../../public/icons/facebook.svg"
import YoutubeIcon from "../../public/icons/youtube.svg"

import VisaIcon from "../../public/icons/visa.svg"
import MastercardIcon from "../../public/icons/mastercard.svg"
import GopayIcon from "../../public/icons/wallet.svg"

const links = {
    Shop: ["All Products", "Promotions", "New Arrivals", "Best Sellers"],
    Support: ["Help Center", "Track Order", "Returns", "Contact Us"],
    Company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
};

const socials =[
    {label: "X", icon: XIcon, href: "#"},
    {label: "IG", icon: InstagramIcon, href: "#"},
    {label: "FB", icon: FacebookIcon, href: "#"},
    {label: "YT", icon: YoutubeIcon, href: "#"},
];

const payments = [
    {label: "Visa", icon: VisaIcon},
    {label: "Mastercard", icon: MastercardIcon},
    {label: "Gopay", icon: GopayIcon},
];

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border px-10 pt-10 pb-6">
            <div className="grid grid-cols-4 gap-8 mb-10">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Revou<span className="text-primary">Shop</span>
                    </h2>
                    <p className="mt-2 text-sm text-muted leading-relaxed max-w-[200px]">
                        Your one-stop marketplace for quality products at great
                        prices.
                    </p>
                    <div className="flex gap-2 mt-4">
                        {socials.map(({ label, icon: Icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 hover:bg-border transition-colors"
                            >
                                <Icon className="w-4 h-4 fill-current"/>
                            </a>
                        ))}
                    </div>
                </div>

                {Object.entries(links).map(([heading, items]) => (
                    <div key={heading}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">
                            {heading}
                        </p>
                        <ul className="flex flex-col gap-2">
                            {items.map((item) => (
                                <li key={`${heading}-${item}`}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted hover:text-foreground transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-border pt-5 flex items-center justify-between">
                <p className="text-xs text-muted">
                    &copy; 2026 Satria Pamungkas. All rights reserved
                </p>
                <div className="flex gap-2">
                    {payments.map(({ label, icon: Icon })=>(
                        <span key={label} className="text-xs px-2.5 py-1 rounded-md border border-border text-muted">
                            <Icon className="w-4 h-4 fill-current"/>
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    );
}
