import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

export default function SlideNext({ children, delay = 0, className = "", duration = 0.5 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView]);

    // Helper: map Tailwind scale to pixels (very simplified!)
    const tailwindToValue = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num * 4; // tailwind spacing scale
    };

    // Parse className for transforms
    const getTransformFromClass = () => {
        const parts = className.split(" ");
        let x = 0, y = 0, rotate = 0;

        parts.forEach((cls) => {
            if (cls.startsWith("translate-x-")) {
                x = tailwindToValue(cls.split("translate-x-")[1]);
            }
            if (cls.startsWith("-translate-x-")) {
                x = -tailwindToValue(cls.split("-translate-x-")[1]);
            }
            if (cls.startsWith("translate-y-")) {
                y = tailwindToValue(cls.split("translate-y-")[1]);
            }
            if (cls.startsWith("-translate-y-")) {
                y = -tailwindToValue(cls.split("-translate-y-")[1]);
            }
            if (cls.startsWith("rotate-")) {
                rotate = parseFloat(cls.split("rotate-")[1]) || 0;
            }
            if (cls.startsWith("-rotate-")) {
                rotate = -parseFloat(cls.split("-rotate-")[1]) || 0;
            }
        });

        return { x, y, rotate };
    };

    const { x, y, rotate } = getTransformFromClass();
    console.log("x:", x, "y:", y, "rotate:", rotate);
    const variants = {
        hidden: {
            opacity: 0,
            x,
            y,
            rotate,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={controls}
            variants={variants}
            transition={{
                type: "spring",
                delay,
                duration,
                damping: 12,
                stiffness: 100,
            }}
        >
            {children}
        </motion.div>
    );
}
