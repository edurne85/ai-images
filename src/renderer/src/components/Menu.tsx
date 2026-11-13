import styled from 'styled-components';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SourceIcon from '@mui/icons-material/Source';
import TagIcon from '@mui/icons-material/Tag';
import { Link } from 'react-router-dom';

const MenuOuterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    height: 100vh;
    width: 100vw;
`;

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    color: #244566;
`;

function Menu(): React.JSX.Element {
    return (
        <MenuWrapper>
            <Link to="/">
                <HomeIcon />
            </Link>
            <Link to="/apps">
                <AppsIcon />
            </Link>
            <Link to="/folders">
                <SourceIcon />
            </Link>
            <Link to="/files">
                <ImageIcon />
            </Link>
            <Link to ="/swaps">
                <PhotoLibraryIcon />
            </Link>
            <TagIcon />
        </MenuWrapper>
    );
}

function WithMenu({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <MenuOuterWrapper>
            <Menu />
            {children}
        </MenuOuterWrapper>
    );
}

export { WithMenu, Menu };
