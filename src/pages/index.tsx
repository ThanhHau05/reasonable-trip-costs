import { useContext } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useDispatch, useSelector } from 'react-redux';

import { VerticalMenu } from '@/components/base';
import { Header, WrapperHeader } from '@/components/layout';
import {
  CreateTheTrip,
  SliderPage,
  StatusCreateTrip,
} from '@/components/pages';
import { VERTICAL_MENU } from '@/constants/select-options';
import { MainContext } from '@/context/main-context';
import { auth } from '@/firebase';
import { selector, UserActions } from '@/redux';

import { Welcome } from './welcome';

const HomePage = () => {
  const { currentUserInformation } = useSelector(selector.user);
  return currentUserInformation?.displayName ? <ContainerHome /> : <Welcome />;
};

const ContainerHome = () => {
  const { currentIdJoinTrip } = useSelector(selector.trip);
  const { currentUserInformation } = useSelector(selector.user);
  const { showverticalmenu, showcreatethetrip } = useContext(MainContext);

  const { id, photoURL, displayName } = currentUserInformation || {};

  return (
    <WrapperHeader
      header={<Header id={id || 0} image={photoURL} name={displayName} />}
    >
      <div className="h-full w-full">
        {showverticalmenu ? (
          <VerticalMenu>
            <RenderItemVerticalMenuHome />
          </VerticalMenu>
        ) : null}
        {showcreatethetrip ? <CreateTheTrip /> : null}
        {currentIdJoinTrip !== 0 ? (
          <div className="h-full">
            <StatusCreateTrip />
          </div>
        ) : (
          <SliderPage />
        )}
      </div>
    </WrapperHeader>
  );
};

const RenderItemVerticalMenuHome = () => {
  const [signOut] = useSignOut(auth);
  const dispatch = useDispatch();

  const onSubmit = async (value: string) => {
    if (value === 'sign out') {
      window.location.reload();
      setTimeout(async () => {
        await signOut();
      }, 200);
      dispatch(
        UserActions.setCurrentUserInformation({
          displayName: '',
          id: 0,
          photoURL: {
            url: undefined,
            color: undefined,
            text: undefined,
          },
          uid: '',
          status: false,
        }),
      );
    }
  };
  return (
    <div className="flex flex-col">
      {VERTICAL_MENU.map((item) => (
        <div
          key={item.value}
          className="mb-2 flex cursor-pointer items-center justify-start rounded-xl bg-slate-300 p-2"
          onClick={() => onSubmit(item.value.toString())}
        >
          {item.icon ? (
            <item.icon className="mr-2 text-xl text-gray-900" />
          ) : null}
          <h2 className="select-none">{item.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
