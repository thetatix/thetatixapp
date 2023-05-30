import { useContext, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
// import Link from 'next/link'
import styles from '@/assets/styles/Modal.module.css'

// status solo puede ser: "success", "danger", "loading"
// message es el mensaje que aparece
// closable: true o false; significa si se puede cerrar la alerta
export default function DynamicModal({active, status, message, closeable}) {
  const [modalActive, setModalActive] = useState(active);

  const closeModal = () => {
    if (closeable) {
      setModalActive(false);
    }
  };
  // const { address } =  useContext(DataContext);

  let statusContent = null;

  if (status === 'success') {
    statusContent = (
      <Image
        src={"/icons/" + status + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (status === 'danger') {
    statusContent = (
      <Image
        src={"/icons/" + status + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (status === 'loading') {
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
  if (!modalActive) {
    return null;
  }
  return (
    <>
        <div className={styles.darken} onClick={closeModal}></div>
        <div className={styles.modal}>
          <div className={styles.modalContainer + ' container'}>
            <div className={styles.content}>
              {closeable && (
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
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
