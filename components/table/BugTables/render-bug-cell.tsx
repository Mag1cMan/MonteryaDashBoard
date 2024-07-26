import React, { useState } from "react";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { BugList } from "../data";
import toast, { Toaster } from 'react-hot-toast';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,Image, User, Tooltip, Chip, ChipProps
} from "@nextui-org/react";

interface Props {
  Bugs: BugList;
  columnKey: keyof BugList;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  true: "success", // Map true to success color
  false: "danger", // Map false to danger color
};

export const RenderBugCell = ({ Bugs, columnKey }: Props) => {
  const cellValue = Bugs[columnKey as keyof BugList];
  const { isOpen: isImageModalOpen, onOpen: onOpenImageModal, onClose: onCloseImageModal } = useDisclosure();
  const { isOpen: isWarningModalOpen, onOpen: onOpenWarningModal, onClose: onCloseWarningModal } = useDisclosure();

  const handleOpenImageModal = (backdrop: any) => {
    onOpenImageModal();
  };

  const handleOpenWarningModal = (backdrop: any) => {
    onOpenWarningModal();
  };

  const handleResolve = async (bugid: string | undefined) => {
    console.log("RESOLVE", bugid);
    const res = await fetch(`https://api.monterya.com/AuthTest/dashboardapi/resolveBug?resolve=${true}&bugid=${bugid}`);
    console.log(res);
    if(!res.ok){
      toast.error('Somthing Went Wrong')
      return;
    }
    toast.success('Issue Resloved')
    onCloseWarningModal();
  };

  const notify = () => toast('Here is your toast.');

  switch (columnKey) {
    case "bugName":
      return <div>{Bugs.bugName}</div>;

    case "bugType":
      return (
        <div>
          <div>
            <span>{Bugs.bugType}</span>
          </div>
        </div>
      );
      
      case "resolve":
      if (Bugs.resolve) {
        return (
          <Chip
            className="capitalize"
            color={statusColorMap["true"]}
            size="sm"
            variant="flat"
          >
            Resolved
          </Chip>
        );
      } else {
        return (
           <>
        <Button
          className="capitalize"
          color={statusColorMap["false"]}
          size="sm"
          variant="flat"
          onClick={handleOpenWarningModal} // Open the warning modal on click
        >
          Resolve
        </Button>
        <Modal size="sm" isOpen={isWarningModalOpen} onClose={onCloseWarningModal}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Resolution
            </ModalHeader>
            <ModalBody>
              Are you sure you want to resolve this bug?
            </ModalBody>
            <ModalFooter className="flex justify-end">
              <Button color="primary" variant="flat" onPress={() => handleResolve(Bugs.BugId)}>
                Confirm
              </Button>
              <Button color="danger" variant="light" onPress={onCloseWarningModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
        );
      }

      case "bugImage":
        return (
          <>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="flat"
                color="primary"
                onPress={() => handleOpenImageModal("blur")}
                className="capitalize text-white bg-blue-700"
              >
                View Picture
              </Button>
            </div>
            <Modal size="full" backdrop="blur" isOpen={isImageModalOpen} onClose={onCloseImageModal}>
              <ModalContent>
                {(onClose: boolean) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Bug Image
                    </ModalHeader>
                    <ModalBody className="flex justify-center items-center">
                      <Image
                        src={Bugs.bugImage}
                        alt="Bug Image"
                        className="m-5"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </ModalBody>
                    <ModalFooter className="flex justify-end">
                      <Button color="danger" variant="light" onPress={onCloseImageModal}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        );

    case "resolve":
      return (
        <div className="flex items-center gap-4">
          <div>
            <Tooltip content="Details">
              <button onClick={() => console.log("View bug", Bugs.BugId)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit bug" color="secondary">
              <button onClick={() => console.log("Edit bug", Bugs.BugId)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Delete bug"
              color="danger"
              onClick={() => console.log("Delete bug", Bugs.BugId)}
            >
              <button>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return <span>{cellValue as string}</span>;
  }
};



