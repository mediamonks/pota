import Routes from './pages/Routes';
import Navigation from './organisms/Navigation';
import { StyledMainContent } from './App.styles';

export default function App(): JSX.Element {
  return (
    <>
      <Navigation />
      <StyledMainContent>
        <Routes />
      </StyledMainContent>
    </>
  );
}
