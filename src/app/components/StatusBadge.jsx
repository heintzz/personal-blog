export default function StatusBadge({ status }) {
  const statusStyles = {
    DRAFT: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    PUBLISHED: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
  };

  const styles = statusStyles[status] || statusStyles.DRAFT;

  return (
    <div
      className={`${styles.bg} mt-1 border ${styles.border} rounded-lg w-fit px-3 py-1.5 text-xs font-semibold flex items-center gap-2`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      <span className={styles.text}>{status}</span>
    </div>
  );
}
