export function SuggestedReading({ message }) {
    return (
         <div className="py-8 text-center text-gray-500">
            <p className="mb-2">
              You can Enter your course details to view your suggested reading
            </p>
            <p className="text-sm">{message}</p>
          </div>
    );
}