import * as React from 'react';
import { useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Checkbox from '@mui/joy/Checkbox';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Stack from '@mui/joy/Stack';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Sheet from '@mui/joy/Sheet';
import Switch from '@mui/joy/Switch';
import Typography from '@mui/joy/Typography';
import TuneIcon from '@mui/icons-material/TuneRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import Done from '@mui/icons-material/Done';
import MenuIcon from '@mui/icons-material/Menu';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShieldIcon from '@mui/icons-material/Shield';
import GavelIcon from '@mui/icons-material/Gavel';
import { DataContext } from './DataContext';
import { useContext } from 'react';
import sweetalert from './alert';
import ReplyIcon from '@mui/icons-material/Reply';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function DrawerFilters() {
  const [open, setOpen] = React.useState(false);
  const { setPage, logoutUser, page, accountName, community, arbitrators} = React.useContext(DataContext);

  const shareCommunity = async () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DRP',
          text: 'See my community on daodrp.com!',
          url: 'https://daodrp.com/community/' + community,
        });
        sweetalert('Successfully shared!');
      } catch (error) {
        sweetalert('Error sharing', error);
      }
    } else {
      // Fallback to copying the URL to the clipboard
      try {
        await navigator.clipboard.writeText('https://daodrp.com/community/' + community);
        sweetalert('Link copied to clipboard');
      } catch (error) {
        sweetalert('Failed to copy link', error);
      }
    }
  };
  

  useEffect(()=>{
    setOpen(false)
  }, [page])

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </Button>
      <Drawer
        size="md"
        variant="plain"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          content: {
            sx: {
              bgcolor: 'transparent',
              p: { md: 3, sm: 0 },
              boxShadow: 'none',
            },
          },
        }}
      >
        <Sheet
          sx={{
            borderRadius: 'md',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <DialogTitle>Dispute Resolution</DialogTitle>
          <ModalClose />
          <DialogContent sx={{ gap: 2 }}>
          <Box
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                  }}
            >
          <Card
                key="1"
                sx={{
                cursor:"pointer",
                boxShadow: 'none',
                '&:hover': { bgcolor: 'background.level1' },
                }}
                onClick={() => setPage("ADD_CLAIM")}
            >
                <CardContent>
                <Typography startDecorator={<AccountBalanceIcon />} level="title-md">File case</Typography>
                </CardContent>
            </Card>
            <Card
                key="2"
                sx={{
                boxShadow: 'none',
                cursor:"pointer",
                '&:hover': { bgcolor: 'background.level1' },
                }}
                onClick={() => setPage("JOIN_CLAIM")}

            >
                <CardContent >
                <Typography startDecorator={<GroupWorkIcon />} level="title-md"> Join case</Typography>
                </CardContent>
            </Card>
            <Card
                key="4"
                sx={{
                boxShadow: 'none',
                cursor:"pointer",
                '&:hover': { bgcolor: 'background.level1' },
                }}
                onClick={()=>setPage("ADD_COMMUNITY")}
            >
                <CardContent>
                <Typography startDecorator={<AddBoxIcon />} level="title-md">Add community</Typography>
                </CardContent>
            </Card>

            {arbitrators?.find((item) => item.arbitrator  == accountName) ? 
          null
          :
          <Card
              key="5"
              onClick={()=>setPage("BECOME_ARBITRATOR")}
              sx={{
              boxShadow: 'none',
              cursor:"pointer",
              '&:hover': { bgcolor: 'background.level1' },
              }}
          >
              <CardContent>
              <Typography startDecorator={<GavelIcon />} level="title-md">Become arbitrator</Typography>
              </CardContent>
          </Card>
          }
                      <Card
                key="6"
                sx={{
                boxShadow: 'none',
                cursor:"pointer",
                '&:hover': { bgcolor: 'background.level1' },
                }}
                onClick={()=>shareCommunity()}
            >
                <CardContent>
                <Typography startDecorator={<ReplyIcon />} level="title-md">Share community</Typography>
                </CardContent>
            </Card>
            </Box>
          </DialogContent>
          <Button onClick={()=>logoutUser()}>Log out ({accountName})</Button>
        </Sheet>
      </Drawer>
    </React.Fragment>
  );
}