import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Slide({ children, delay, className }) {
    const ref = useRef(null);
    const isInview = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInview) {
            controls.start("visible");
        }
    }, [isInview]);

    return (
        <motion.div
            ref={ref}
            variants={{
                hidden: { opacity: 0,  },
                visible: { opacity: 1, },
            }}
            transition={{
                type: "spring",
                duration: 0.2,
                damping: 8,
                delay: delay,
                stiffness: 100,
            }}
            initial="visible"
            animate={controls}
            className={className}
        >
            {children}
        </motion.div>
    );
}
