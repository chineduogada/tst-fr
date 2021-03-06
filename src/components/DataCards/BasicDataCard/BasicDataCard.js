import React from "react";
import { IoIosLink } from "react-icons/io";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import classes from "./BasicDataCard.module.scss";
import { Tooltip } from "@material-ui/core";

const BasicDataCard = ({ data, text, url, footer }) => {
  return (
    <div className={classes.BasicDataCard}>
      <div className={classes.Body}>
        {data ? (
          <>
            <h4>{data}</h4>
            <p>{text}</p>
          </>
        ) : (
          <Loader />
        )}
      </div>
      <div className={classes.Footer}>{footer}</div>

      <span className={classes.LinkIcon}>
        <Tooltip title={`go to ${text}`}>
          <Link to={url}>
            <IoIosLink />
          </Link>
        </Tooltip>
      </span>
    </div>
  );
};

export default BasicDataCard;
