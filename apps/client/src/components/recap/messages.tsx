import { TopReactedMessages } from '@/components/messages/TopReactedMessages';
import { yearToDateRange, type CommonRecapComponentProps } from '@/components/recap/common';
import { StampImage } from '@/composables/useStampPicker';
import { useMessageStamps } from '@/hooks/useMessageStamps';
import { useState, type ChangeEvent, type FC } from 'react';

export const HighlightedMessages: FC<CommonRecapComponentProps> = ({ userId, year }) => {
  const { getStamp } = useMessageStamps();
  const [highlightedStampId, setHighlightedStampId] = useState<string>('');

  const highlightStamps = [
    // w
    '6308a443-69f0-45e5-866f-56cc2c93578f',
    // ranpuro_4
    'e77c3b8a-9ac2-45b1-b16b-11b1f3dcbc31',
    // ranpuro_5
    '8940a6d9-8c35-48a9-87e3-88ed6a779b4b',
    // pro
    'fa5ce69d-b00a-45e6-a516-5f5e1549fbef',
    // amazed_fuzzy
    'ea41ed1e-455a-4902-95ad-b1fb39570f72',
    // wakaru
    '1c891de7-e68c-4aa5-9cce-28f0ca74522c',
    // iihanashi
    'b3883f9f-1efe-40ee-9d66-5f0615a3bfb7',
    // iine
    'b1f11ef6-d4c5-4a8f-a630-94b7acccb1c0',
    // odaijini
    '1dcda7cd-7824-43fb-9e1d-6bb8602910d4',
    // kawaii
    'ca329a82-028c-4180-b66b-92de5a025016',
    // niowase
    'fe8966e9-a594-4563-88cd-fb38d86bc771',
    // koresuki
    'bf5b0f20-c224-45de-9ecc-3b768a0aabde',
    // otsukare
    '19eb80ae-0467-4409-ad21-5dc5d0148fd6',
    // tada
    '8bfd4032-18d1-477f-894c-08855b46fd2f',
    // ganbare-
    'cba0715c-4c58-43a5-a221-49b401f6f734',
    // koreni_natteru
    'de4b7156-ebc8-46eb-919f-b10ef96b0b54',
    // crying-hard
    '6f23c19d-f1a1-4deb-9e4f-b182c13aeccc',
    // oishisou
    '4255a0b0-0289-48cd-be19-34bd8b7bf12b',
    // iina-
    '9453e47a-6816-463c-aa12-2eccb2335381',
    // sugoi_
    '6b01b1d2-1d18-4681-93c9-d93b7e277cd2',
    // blob_sad
    'd395ef00-2173-4c82-90f1-aa35fa44509c',
    // blobcheer
    '46d1f4f8-6c21-47d9-8e8a-6536a7b0f4df',
    // eyes_sad
    'cff4fc64-e227-452f-8936-5041666088b6',
    // ohagoza
    '54d2ce07-4ed0-4539-b3ab-58f31a82f6b4',
    // amazed_amazed_fuzzy
    'a1d92d72-4e31-43df-bd53-80000e7cfc25',
    // ayase_iyaa
    '8b9d2d4f-a9cd-48de-9fc4-cd43ddf52e14',
    // kawaisou
    '037f37fd-1a54-41a7-aa5c-5d1b00d3b714',
    // kakkoii
    'bf6861a1-3c34-454a-bfdd-e9c393096f04',
    // omedetou
    'dbcc7871-efef-4d6d-a2c6-b0f187f7b936',
    // all
    '',
  ];

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.checked) {
      setHighlightedStampId(ev.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-2">
        {highlightStamps.map((stampId) => (
          <div key={stampId}>
            <input
              id={`stamp-${stampId}`}
              name="highlighted-messages"
              type="radio"
              className="hidden peer"
              onChange={changeHandler}
              value={stampId}
              checked={highlightedStampId === stampId}
            />
            <label
              htmlFor={`stamp-${stampId}`}
              className="flex justify-center items-center bg-gray-100 rounded-md px-2 py-1 peer-checked:bg-blue-200"
              title={`:${getStamp(stampId)?.name}:`}
            >
              {stampId === '' ? <span className="font-bold">ALL</span> : <StampImage stampId={stampId} size={24} />}
            </label>
          </div>
        ))}
      </div>
      <TopReactedMessages stampId={highlightedStampId || null} receivedUserId={userId} range={yearToDateRange(year)} />
    </div>
  );
};
