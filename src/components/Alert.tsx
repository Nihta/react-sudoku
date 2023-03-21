type AlertProps = {
  title?: string;
  content: string;
};

const Alert = (props: AlertProps) => {
  const { title, content } = props;

  return (
    <div className="alert alert-primary  show" role="alert">
      {title && <strong>{title}</strong>} {content}
    </div>
  );
};

export default Alert;
