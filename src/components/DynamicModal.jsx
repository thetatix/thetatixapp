import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
// import Link from 'next/link'
import styles from '@/assets/styles/Modal.module.css'

// status solo puede ser: "success", "danger", "loading"
// message es el mensaje que aparece
// closable: true o false; significa si se puede cerrar la alerta
export default function DynamicModal() {
  // const { modalActive, setModalActive,   } = useContext(DataContext);

  const { ModalActive, setModalActive, ModalStatus, setModalStatus, ModalMessage, setModalMessage, ModalCloseable, setModalCloseable } = useContext(DataContext);

  // const [modalActive, setModalActive] = useState(active);
  // useEffect(()=>{
  //   setModalActive(active);
  // },[active])
  // console.log('modalActive',active, status, message, closeable)
  const closeModal = () => {
    if (ModalCloseable) {
      setModalActive(false);
    }
  };
  // const { address } =  useContext(DataContext);

  let statusContent = null;

  if (ModalStatus === 'success') {
    statusContent = (
      <Image
        src={"/icons/" + ModalStatus + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (ModalStatus === 'danger') {
    statusContent = (
      <Image
        src={"/icons/" + ModalStatus + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (ModalStatus === 'loading') {
    statusContent = (
      <div className={styles.loadingWheel}>
        <div className={styles.wheel}></div>
      </div>
    );
  } else {
    statusContent = (
      <Image
        src={"/icons/info-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  }
  if (!ModalActive) {
    return null;
  }
  return (
    <>
        <div className={styles.darken} onClick={closeModal}></div>
        <div className={styles.modal}>
          <div className={styles.modalContainer + ' container'}>
            <div className={styles.content}>
              {ModalCloseable && (
                <div className={styles.closeBtn}>
                  <button onClick={closeModal}>
                    <Image
                      src={"/icons/close.svg"}
                      alt="Close icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              )}
              <div className={styles.img}>
                {statusContent}
              </div>
              <div className={styles.text}>
                <p>
                  {ModalMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
