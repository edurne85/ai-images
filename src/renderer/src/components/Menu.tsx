import styled from 'styled-components';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SourceIcon from '@mui/icons-material/Source';
import TagIcon from '@mui/icons-material/Tag';
import { Link } from 'react-router-dom';

const MenuOuterWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    &, a, a:visited {
        color: #A2ECFB;
    }
    a:active {
        color: #ECFBA2;
    }
    a:hover {
        color: #A2FBEC;
    }
`;

function Menu(): React.JSX.Element {
    return (
        <MenuWrapper>
            <Link to="/">
                <HomeIcon />
            </Link>
            <AppsIcon />
            <SourceIcon />
            <ImageIcon />
            <PhotoLibraryIcon />
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
