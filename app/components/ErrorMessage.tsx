type Props = {
  title?: string;
  message?: string;
};

export default function ErrorMessage({
  title = "Error loading data",
  message = "Unable to fetch data. Please try again later."
}: Props) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p className="font-bold">{title}</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
