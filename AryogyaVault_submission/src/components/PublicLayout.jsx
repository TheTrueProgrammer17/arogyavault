import { Outlet } from 'react-router-dom';
import GovTopBar from './GovTopBar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <GovTopBar />
      <Navbar onMenuClick={() => {}} />
      <main style={{ minHeight: 'calc(100vh - 104px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
