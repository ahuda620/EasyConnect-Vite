import styles from "./SkillsPage.module.css";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import BounceLoader from "react-spinners/BounceLoader";
import { useIsMobile } from "../context/MobileContext";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faXmark,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import fetchUserSkills from "../util/fetchUserSkills";
import updateUserSkills from "../util/updateUserSkills";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

export default function ProfilePage() {
  const [userSkills, setUserSkills] = useState([]); //State that holds the fetched userSkills
  const [isEditMode, setIsEditMode] = useState(false); //State that determines if the edit and delete icons are displayed, or if the checkmark/save icon is displayed
  const [editSkillIndex, setEditSkillIndex] = useState(null); //State that determines if the corresponding list item (a.k.a skill) is editable
  const [newSkill, setNewSkill] = useState(""); //State that holds the new skill to be added
  const [showEmptyInputAlert, setShowEmptyInputAlert] = useState(false);
  const [showOnlyLettersAlert, setShowOnlyLettersAlert] = useState(false);

  const { user } = useUser();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const location = useLocation();

  //Fetch user skills using Tan Stack Query
  const {
    isLoading: isUserSkillsLoading,
    isFetching: isUserSkillsFetching,
    isError: isUserSkillsError,
    isSuccess: isUserSkillsSuccess,
    data: userSkillsData,
  } = useQuery({
    queryKey: ["userSkills", user?.id],
    queryFn: () => fetchUserSkills(user?.id),
    enabled: !!user?.id,
  });

  //Effect to handle userSkills success state
  useEffect(() => {
    if (isUserSkillsSuccess && userSkillsData?.length > 0) {
      const formattedSkills = handleFormatSkills(userSkillsData);
      setUserSkills(formattedSkills);
    }
  }, [isUserSkillsSuccess, userSkillsData]);

  useEffect(() => {
    if (isUserSkillsError) {
      toast.error("An error occured while fetching user skills.");
    }
  }, [isUserSkillsError]);

  //Tan Stack Query Mutation to update userskills in database and refetch them
  const mutation = useMutation({
    mutationFn: (newSkills) => updateUserSkills(user?.id, newSkills),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkills", user?.id] });
    },
  });

  //Function that toggles edit mode UI changes
  //Hides delete, edit icon, and add skill field, displays checkmark/save icon and makes corresponding skill editable
  const handleEditSkillClick = (index) => {
    setEditSkillIndex(index); //Enter edit skill mode
    setIsEditMode(true);
  };

  //Function that handles adding the new editted skill value into the userSkills state
  const handleEditSkill = (index, value) => {
    setUserSkills((prevSkills) =>
      prevSkills.map((skill, i) => (i === index ? value : skill))
    );
  };

  //Function that saves the editted skill
  //Exits edit mode, and calls Tan Stack mutation to update UI and database
  const handleSaveEditedSkill = async () => {
    setEditSkillIndex(null); // Exit edit skill mode
    setIsEditMode(false);

    try {
      await mutation.mutateAsync(userSkills);
      toast.success("Skill edited successfully.");
    } catch (error) {
      toast.error("An error occurred while editing the skill.");
    }
  };

  //Function that handles adding a new user skill and calls Tan stack mutation to update UI and database
  const handleAddSkill = async (newSkill) => {
    if (newSkill.trim() !== "") {
      if (validateSearchInput(newSkill)) {
        const updatedSkills = [...userSkills, newSkill];
        setUserSkills(updatedSkills);

        try {
          await mutation.mutateAsync(updatedSkills);
          toast.success("Skill added successfully.");
        } catch (error) {
          toast.error("An error occurred while adding the skill.");
        }
      } else {
        //handle input with numbers
        setShowOnlyLettersAlert(true);
        setTimeout(() => setShowOnlyLettersAlert(false), 2000); //Hide alert after 2 seconds
      }
    } else {
      //handle empty skill input
      setShowEmptyInputAlert(true);
      setTimeout(() => setShowEmptyInputAlert(false), 2000); //Hide alert after 2 seconds
    }
  };

  //Function that handles deleting a user skill and calls Tan stack mutation to update UI and database
  const handleDeleteSkill = async (index) => {
    const updatedSkills = userSkills.filter((skill, i) => i !== index);
    setUserSkills(updatedSkills);

    try {
      await mutation.mutateAsync(updatedSkills);
      toast.success("Skill deleted successfully.");
    } catch (error) {
      toast.error("An error occurred while deleting the skill.");
    }
  };

  //Function that captilizes the first letter of each word in a user skill for aesthetics
  const handleFormatSkills = (skills) => {
    return skills.map((skill) =>
      skill
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  function validateSearchInput(userInput) {
    const isValid = /^[a-zA-Z\s]*$/.test(userInput);
    if (!isValid) {
      return false;
    }

    return DOMPurify.sanitize(userInput);
  }

  /*effect to fix page not taking up full height on mobile*/
  useEffect(() => {
    if (isMobile && location.pathname === "/skills") {
      document.documentElement.classList.add("overflow-visible"); //make overflow visible on root element
      document.body.classList.add("overflow-visible");
    } else {
      document.documentElement.classList.remove("overflow-visible"); //make overflow visible on root element
      document.body.classList.remove("overflow-visible");
    }
  }, [isMobile, location.pathname]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Skills</h1>
      <p className={styles.subText}>Add your job related skills below!</p>
      <ul className={styles.skillsList}>
        {userSkills?.length > 0 ? (
          userSkills.map((skill, index) => (
            <li key={index} className={styles.skill}>
              {editSkillIndex === index ? (
                <input
                  type="text"
                  value={userSkills[index]}
                  onChange={(e) => handleEditSkill(index, e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEditedSkill();
                    }
                  }}
                  className={styles.editSkill}
                />
              ) : (
                <span>{skill}</span>
              )}
              <div className={styles.icons}>
                {!isEditMode ? (
                  <>
                    <button
                      className={styles.pageButton}
                      onClick={() => handleEditSkillClick(index)}
                    >
                      <FontAwesomeIcon
                        className={styles.faEditIcon}
                        icon={faPen}
                      />
                    </button>
                    <button
                      className={styles.pageButton}
                      onClick={() => handleDeleteSkill(index)}
                    >
                      <FontAwesomeIcon
                        className={styles.faXmarkIcon}
                        icon={faXmark}
                      />
                    </button>
                  </>
                ) : (
                  <button
                    className={styles.pageButton}
                    onClick={handleSaveEditedSkill}
                  >
                    <FontAwesomeIcon
                      className={styles.faCheckIcon}
                      icon={faCheck}
                    />
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className={styles.noSkillsText}>No skills added</p>
        )}
        {!isEditMode && (
          <li className={styles.addSkillField}>
            <input
              type="text"
              value={newSkill}
              placeholder="Enter a skill here"
              onChange={(e) => {
                setNewSkill(e.target.value);
              }}
            />
            <button
              className={styles.pageButton}
              onClick={() => {
                handleAddSkill(newSkill);
                setNewSkill("");
              }}
            >
              <FontAwesomeIcon className={styles.faPlusIcon} icon={faPlus} />
            </button>
          </li>
        )}
      </ul>
      {showEmptyInputAlert && (
        <span className={styles.alert}>Search input cannot be empty</span>
      )}
      {showOnlyLettersAlert && (
        <span className={styles.alert}>
          Numbers and symbols are not allowed
        </span>
      )}
      {isUserSkillsLoading ||
        (isUserSkillsFetching && (
          <BounceLoader color="#f43f7f" className={styles.loadingAnimation} />
        ))}
    </div>
  );
}
