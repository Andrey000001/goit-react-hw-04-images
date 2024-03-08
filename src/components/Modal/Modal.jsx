import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalContent, Img } from './Modal.styled';
const modalRoot = document.querySelector('#modal-root');

function Modal({ closeModal, url }) {
  const handleCloseModal = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return createPortal(
    <Overlay onClick={handleCloseModal}>
      <ModalContent>
        <Img src={url} alt="#" />
      </ModalContent>
    </Overlay>,
    modalRoot
  );
}

export default Modal;
