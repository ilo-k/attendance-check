export function Modal({ title, message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
}
