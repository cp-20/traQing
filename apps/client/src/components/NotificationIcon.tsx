import type { FC } from 'react';

type NotificationIconProps = {
  level: number;
};

export const NotificationIcon: FC<NotificationIconProps> = ({ level }) => {
  if (level === 1) return <SubscribedIcon />;
  if (level === 2) return <NotifiedIcon />;
  return <NotSubscribedIcon />;
};

const NotSubscribedIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 17H7.5V10.5C7.5 8 9.5 6 12 6C14.5 6 16.5 8 16.5 10.5V17ZM18.5 16V10.5C18.5 7.43 16.36 4.86 13.5 4.18V3.5C13.5 3.10218 13.342 2.72064 13.0607 2.43934C12.7794 2.15804 12.3978 2 12 2C11.6022 2 11.2206 2.15804 10.9393 2.43934C10.658 2.72064 10.5 3.10218 10.5 3.5V4.18C7.63 4.86 5.5 7.43 5.5 10.5V16L3.5 18V19H20.5V18L18.5 16ZM12 22C12.5304 22 13.0391 21.7893 13.4142 21.4142C13.7893 21.0391 14 20.5304 14 20H10C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22Z"
      fill="currentColor"
    />
  </svg>
);

const SubscribedIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.5 10.5V16L20.5 18V19H3.5V18L5.5 16V10.5C5.5 7.43 7.63 4.86 10.5 4.18V3.5C10.5 3.10218 10.658 2.72064 10.9393 2.43934C11.2206 2.15804 11.6022 2 12 2C12.3978 2 12.7794 2.15804 13.0607 2.43934C13.342 2.72064 13.5 3.10218 13.5 3.5V4.18C16.36 4.86 18.5 7.43 18.5 10.5ZM7.5 10.5V17H16.5V10.5C16.5 8 14.5 6 12 6C9.5 6 7.5 8 7.5 10.5Z"
      fill="currentColor"
    />
    <path
      d="M13.4142 21.4142C13.0391 21.7893 12.5304 22 12 22C11.4696 22 10.9609 21.7893 10.5858 21.4142C10.2107 21.0391 10 20.5304 10 20H14C14 20.5304 13.7893 21.0391 13.4142 21.4142Z"
      fill="currentColor"
    />
  </svg>
);

const NotifiedIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.5 10.5V16L20.5 18V19H3.5V18L5.5 16V10.5C5.5 7.43 7.63 4.86 10.5 4.18V3.5C10.5 3.10218 10.658 2.72064 10.9393 2.43934C11.2206 2.15804 11.6022 2 12 2C12.3978 2 12.7794 2.15804 13.0607 2.43934C13.342 2.72064 13.5 3.10218 13.5 3.5V4.18C16.36 4.86 18.5 7.43 18.5 10.5Z"
      fill="currentColor"
    />
    <path
      d="M13.4142 21.4142C13.0391 21.7893 12.5304 22 12 22C11.4696 22 10.9609 21.7893 10.5858 21.4142C10.2107 21.0391 10 20.5304 10 20H14C14 20.5304 13.7893 21.0391 13.4142 21.4142Z"
      fill="currentColor"
    />
  </svg>
);
