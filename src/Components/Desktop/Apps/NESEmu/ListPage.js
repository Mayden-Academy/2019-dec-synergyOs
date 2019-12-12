import React, { Component } from "react";
import "./ListPage.css";
import { ListGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import config from "./config";

import RomLibrary from "./RomLibrary";

class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      romLibrary: RomLibrary.load()
    };
  }
  render() {
    return (
      <div
        className="container ListPage my-4"
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div className="row justify-content-center">
          <div className="col-md-8">
            <header className="mb-4">
              <h1 className="mb-3">JSNES</h1>
              <p>
                A JavaScript NES emulator.{" "}
                <a href="https://github.com/bfirsh/jsnes">Source on GitHub.</a>
              </p>
            </header>

            <ListGroup className="mb-4">
              {Object.keys(config.ROMS)
                .sort()
                .map(key => (
                  <Link
                    key={key}
                    to={"/run/" + encodeURIComponent(key)}
                    className="list-group-item"
                  >
                    {config.ROMS[key]["name"]}
                    <span className="float-right">&rsaquo;</span>
                  </Link>
                ))}
            </ListGroup>

            {this.state.romLibrary.length > 0 ? (
              <div>
                <p>Previously played:</p>

                <ListGroup className="mb-4">
                  {this.state.romLibrary
                    .sort((a, b) => new Date(b.added) - new Date(a.added))
                    .map(rom => (
                      <Link
                        key={rom.hash}
                        to={"run/local-" + rom.hash}
                        className="list-group-item"
                      >
                        {rom.name}
                        <a
                          onClick={e => {
                            e.preventDefault();
                            this.deleteRom(rom.hash);
                          }}
                          className="delete"
                          title="Delete"
                        >
                          &times;
                        </a>
                        <span className="float-right">&rsaquo;</span>
                      </Link>
                    ))}
                </ListGroup>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  deleteRom = hash => {
    RomLibrary.delete(hash);
    this.updateLibrary();
  };

  updateLibrary = () => {
    this.setState({ romLibrary: RomLibrary.load() });
  };

  handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  handleDrop = e => {
    e.preventDefault();

    const file = e.dataTransfer.items
      ? e.dataTransfer.items[0].getAsFile()
      : e.dataTransfer.files[0];

    RomLibrary.save(file).then(rom => {
      this.updateLibrary();
      this.props.history.push({ pathname: "run/local-" + rom.hash });
    });
  };
}

export default ListPage;