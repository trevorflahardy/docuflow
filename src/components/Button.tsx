import classNames from "classnames";
import { Link } from "react-router-dom";

export interface ButtonProps {
    /**
     * The text to display on the button.
     */
    text: string;

    /**
     * The color of the button.
     */
    color?: "primary" | "secondary";

    /**
     * An icon to display on the button.
     */
    icon?: React.ReactNode;

    /**
     * A link to navigate to.
     */
    link?: string;

    /**
     * Denotes if this link should be a react router dom link or a normal anchor tag.
     */
    reactLink?: boolean;
}

export default function Button({text, color, icon, link, reactLink}: ButtonProps): React.ReactElement {
    let className;
    if (color === "primary") {
        className = "bg-accent-light dark:bg-accent-dark text-white";
    }
    else {
        className = "outline outline-2 outline-accent-light bg-white text-accent-light";
    }

    const contentMeat = () => {
        return (
            <>
                <div className={classNames(
                    "px-4 py-3 font-semibold flex items-center justify-center rounded-xl drop-shadow-md min-w-28 gap-2",
                    className
                )}>
                    {icon}
                    <p className="!mb-0">
                        {text}
                    </p>
                </div>
            </>
        )
    }

    return (
        <>
            {link ? (
                reactLink ? (
                    <Link to={link}>
                        {contentMeat()}
                    </Link>
                ): (
                    <a href={link}>
                        {contentMeat()}
                    </a>
                )
            ) : contentMeat()}
        </>
    )
}