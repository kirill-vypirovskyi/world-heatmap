type Props = {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filename?: string;
}

export const FileInput = ({ onFileChange, filename = 'No file choosed' }: Props) => {
  return (
    <div className="file has-name is-fullwidth">
      <label className="file-label">
        <input className="file-input" type="file" name="resume" onChange={onFileChange}/>
        <span className="file-cta">
          <span className="file-icon">
            <i className="fas fa-upload" />
          </span>
          <span className="file-label">Choose a file…</span>
        </span>
        <span className="file-name">
          {filename}
        </span>
      </label>
    </div>
  );
};
