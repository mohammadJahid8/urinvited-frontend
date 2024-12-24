'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCircle, Users } from 'lucide-react';
import GroupGuestModal from './group-guest-modal';

interface Guest {
  id: string;
  name: string;
  contact: string;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', contact: '' });
  const [rows, setRows] = useState(2); // Number of empty input rows to show
  const [openGroupModal, setOpenGroupModal] = useState(false);

  const handleAddGuest = (index: number) => {
    if (!newGuest.name || !newGuest.contact) return;

    const guest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGuest.name,
      contact: newGuest.contact,
    };

    setGuests([...guests, guest]);
    setNewGuest({ name: '', contact: '' });
  };

  const handleAddRow = () => {
    setRows(rows + 1);
  };

  return (
    <div className='w-full'>
      <p className='text-sm text-primary pb-2 text-end cursor-pointer hoverl:underline'>
        Upload CSV
      </p>
      <Table className=''>
        <TableHeader className='bg-gray-100 rounded-lg'>
          <TableRow className='rounded-lg'>
            <TableHead className='rounded-tl-lg border-r text-black'>
              Guest Name
            </TableHead>
            <TableHead className='border-r text-black'>
              Phone/ Email Address
            </TableHead>
            <TableHead className='w-[100px] rounded-tr-lg text-black'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='rounded-b-lg border'>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className='border-r'>
                <Input
                  placeholder='Enter name'
                  value={index === 0 ? newGuest.name : ''}
                  onChange={(e) =>
                    index === 0 &&
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell className='border-r'>
                <Input
                  placeholder='Enter Phone or Email address'
                  value={index === 0 ? newGuest.contact : ''}
                  onChange={(e) =>
                    index === 0 &&
                    setNewGuest({ ...newGuest, contact: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setOpenGroupModal(true)}
                  >
                    <Users className='w-5 h-5 text-blue-500' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleAddGuest(index)}
                  >
                    Add
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant='outline'
        className='mt-4 border-dashed w-full'
        onClick={handleAddRow}
      >
        + Add Guests
      </Button>

      {guests.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Added Guests</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Phone/ Email Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>{guest.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <GroupGuestModal
        open={openGroupModal}
        onOpenChange={setOpenGroupModal}
        onAddGuests={() => {}}
      />
    </div>
  );
}
