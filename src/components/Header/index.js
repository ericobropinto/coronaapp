import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FiX,
  FiUser,
  FiShare2,
  FiMapPin,
  FiClipboard,
  FiLogOut,
  FiArrowDownRight,
  FiMenu,
} from 'react-icons/fi';

import {
  Container,
  MenuContainer,
  MenuLeft,
  Items,
  ItemMenu,
  Name,
  HeadMenu,
  Description,
  Version,
  Image,
} from './styles';

import Share from '../Share';

import { signOut } from '../../actions/AuthActions';
import { getInfos } from '../../actions/DegreeRiskActions';

// Assets
import logo from '../../assets/images/logo2.png';

const greenColor = '#03A39B';

const IconMenu = ({ Component }) => (
  <Component style={{ color: greenColor, fontSize: 20 }} />
);

export default function Header({ title, onClick }) {
  const history = useHistory();
  const Dispatch = useDispatch();

  const [openMenu, setMenu] = useState(false);
  const [openShare, setShare] = useState(false);
  const [infos, setInfos] = useState({ name: '', grauDeRisco: '' });

  function setSignOute() {
    signOut();
    history.push('/login');
  }

  function handleShare() {
    setMenu(false);
    setShare(!openShare);
  }

  useEffect(() => {
    const uid = localStorage.getItem('Uid');
    const Signed = localStorage.getItem('Signed') || null;
    if (Signed) {
      Dispatch(getInfos(uid)).then(res => {
        setInfos(res);
      });
    }
  }, []);

  return (
    <>
      <Container onClick={onClick}>
        <FiMenu
          onClick={() => setMenu(!openMenu)}
          style={{ fontSize: 32, color: greenColor, cursor: 'pointer' }}
        />
        <Image src={logo} alt="logo" />
        <div />
      </Container>
      <MenuContainer active={openMenu}>
        <MenuLeft>
          <HeadMenu>
            <FiX
              onClick={() => setMenu(!openMenu)}
              style={{ fontSize: 20, color: greenColor }}
            />
          </HeadMenu>
          <Description>Olá</Description>
          <Name>{infos.name}</Name>
          <Description>
            {infos.grauDeRisco} Risco
            <FiArrowDownRight
              style={{ fontSize: 14, color: greenColor, marginBottom: -3 }}
            />
          </Description>
          <Items>
            <ItemMenu as={Link} to="#">
              <IconMenu Component={FiUser} /> MEUS DADOS
            </ItemMenu>
            <ItemMenu as={Link} to="#">
              <IconMenu Component={FiClipboard} /> MEUS SISTEMAS
            </ItemMenu>
            <ItemMenu as={Link} to="#">
              <IconMenu Component={FiMapPin} /> MAPA DE RISCO
            </ItemMenu>
            <ItemMenu onClick={handleShare}>
              <IconMenu Component={FiShare2} /> COMPARTILHE
            </ItemMenu>
          </Items>
          <ItemMenu onClick={() => setSignOute()}>
            <IconMenu Component={FiLogOut} /> SAIR
          </ItemMenu>
          <Version>Versão 1.0.1</Version>
        </MenuLeft>
      </MenuContainer>
      <Share active={openShare} onClose={handleShare} />
    </>
  );
}
