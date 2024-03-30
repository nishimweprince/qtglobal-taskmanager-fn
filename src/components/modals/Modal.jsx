import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Button from "../inputs/Button";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const JSX_MODAL = ({
    isOpen,
    children,
    onClose,
    className,
    mainClassName = null,
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isOpen]);

    return (
        <main
            className={`${isOpen ? "opacity-1" : "opacity-0 pointer-events-none"
                } min-h-screen flex items-center justify-center flex-col gap-6 fixed top-0 bottom-0 left-0 right-0 z-[1000] bg-black bg-opacity-30 transition-opacity ease-in-out duration-300 ${mainClassName}`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <section
                className={`flex min-w-[40%] max-w-[1000px] flex-col z-[100000] bg-white h-fit gap-4 p-8 py-6 relative shadow-md rounded-md ${className}`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >

                <FontAwesomeIcon
                    className="text-[25px] !bg-transparent !px-0 !py-0 absolute right-6 top-6 text-primary cursor-pointer transition-all hover:scale-[1.02]"
                    icon={faCircleXmark}
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                />
                {children}
            </section>
        </main>
    );
};

JSX_MODAL.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    mainClassName: PropTypes.string,
};

const Modal = (props) => {
    const modalContainer = document.querySelector("#modal");
    if (!modalContainer) {
        throw new Error("Modal container not found");
    }

    return ReactDOM.createPortal(<JSX_MODAL {...props} />, modalContainer);
};

export default Modal;
