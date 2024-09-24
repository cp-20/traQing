import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="text-2xl font-semibold">
        <span>{location.pathname}</span>
        <span> というページは見つかりませんでした</span>
      </div>
      <div>
        <Link to="/" className="underline text-blue-500">
          トップページに戻る
        </Link>
      </div>
    </div>
  );
};
