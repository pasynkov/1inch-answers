import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from 'ethers';

describe("ReadPrivate", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const number = Math.floor(Math.random() * 100);
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ReadPrivate = await ethers.getContractFactory("ReadPrivate");
    const readPrivate = await ReadPrivate.deploy(number, {});

    return { readPrivate, owner, otherAccount, number };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { readPrivate, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await readPrivate.owner()).to.equal(owner.address);
    });

  });

  describe("Read Variables", function () {
    it("public variable is equal from constructor", async function () {
      const { readPrivate, number } = await loadFixture(deployOneYearLockFixture);
      const variable = (await readPrivate.getVariable()).toNumber();
      await expect(variable).to.equal(number);
    });

    it("incremented variable is more by one than public", async function () {
      const { readPrivate, number } = await loadFixture(deployOneYearLockFixture);
      const variable = (await readPrivate.getIncremented()).toNumber();
      await expect(variable).to.equal(number + 1);
    });

    it("read variables from storage slot", async function () {
      const { readPrivate, number } = await loadFixture(deployOneYearLockFixture);

      const publicVariable = BigNumber.from(await ethers.provider.getStorageAt(readPrivate.address, 1)).toNumber();
      const incrementedVariable = BigNumber.from(await ethers.provider.getStorageAt(readPrivate.address, 2)).toNumber();

      await expect(publicVariable).to.equal(number);
      await expect(incrementedVariable).to.equal(number + 1);

    });
  });

});
