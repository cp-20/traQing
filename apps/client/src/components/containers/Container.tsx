import { IconChevronLeft } from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';

type ContainerProps = {
  children: ReactNode;
};

export const Container: FC<ContainerProps> = ({ children }) => {
  return <div className="bg-gray-100 min-h-screen sm:p-8 p-4 flex flex-col sm:gap-8 gap-4">{children}</div>;
};

type ContainerTitleProps = {
  children: ReactNode;
};

export const ContainerTitle: FC<ContainerTitleProps> = ({ children }) => {
  return (
    <>
      <div className="lg:hidden flex">
        <Link
          to="/"
          className="px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
      </div>
      <div className="flex gap-8 justify-center items-center relative">
        <Link
          to="/"
          className="absolute top-1/2 -translate-y-1/2 left-0 px-4 py-2 flex justify-center items-center font-semibold hover:bg-gray-200 duration-200 transition-all rounded-md max-lg:hidden"
        >
          <IconChevronLeft />
          <span>ホームに戻る</span>
        </Link>
        <div className="flex items-center">{children}</div>
      </div>
    </>
  );
};
