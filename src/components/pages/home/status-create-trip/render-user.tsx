import clsx from 'clsx';
import { useEffect } from 'react';
import { GrClose } from 'react-icons/gr';
import { useSelector } from 'react-redux';

import { Avatar } from '@/components/base';
import type { UserInformation } from '@/constants/select-options';
import { DataFirebase } from '@/firebase';
import { selector } from '@/redux';

import { handleDataFirebaseRenderUser } from './handler';

export const RenderUser = ({
  userlist,
  setUserList,
}: {
  userlist: UserInformation[];
  setUserList: (value: UserInformation[]) => void;
}) => {
  const { currentIdJoinTrip } = useSelector(selector.trip);
  const { currentUserInformation } = useSelector(selector.user);

  useEffect(() => {
    if (currentIdJoinTrip) {
      handleDataFirebaseRenderUser(currentIdJoinTrip, setUserList);
    }
  }, [currentIdJoinTrip]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {userlist &&
        userlist.map((item) => (
          <div
            key={item.uid}
            className="relative z-20 inline-block drop-shadow-md"
          >
            <div className="group relative inline-block">
              <span className="absolute -top-7 z-10 ml-0 hidden rounded-2xl border bg-white px-2 py-0.5 text-xs font-medium group-hover:block">
                {item.displayName}
              </span>
              <Avatar
                img={{
                  url: item.photoURL.url,
                  color: item.photoURL.color || '',
                  text: item.displayName[0]?.toUpperCase() || '',
                }}
              />
              <span
                className={clsx(
                  'absolute bottom-px right-[3px] h-2 w-2 rounded-full border border-white drop-shadow-md',
                  item.status ? 'bg-green-500' : 'bg-orange-500',
                )}
              />
              <div
                className={clsx(
                  'invisible absolute bottom-0 flex w-full justify-center transition-all duration-100',
                  item.uid !== currentUserInformation.uid
                    ? 'group-hover:visible group-hover:-translate-y-3'
                    : null,
                )}
              >
                <GrClose
                  className="cursor-pointer rounded-full bg-slate-600 p-1 text-lg drop-shadow-md"
                  onClick={() =>
                    DataFirebase.RefuseInvitation(item.uid, currentIdJoinTrip)
                  }
                />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
