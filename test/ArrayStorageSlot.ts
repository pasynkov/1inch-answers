import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from 'ethers';

describe("ArrayStorageSlot", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const ArrayStorageSlot = await ethers.getContractFactory("ArrayStorageSlot");
    const arrayStorageSlot = await ArrayStorageSlot.deploy();

    return { arrayStorageSlot, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { arrayStorageSlot, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await arrayStorageSlot.owner()).to.equal(owner.address);
    });

  });

  describe("Read variables", function () {
    it("Writes number and fill array", async function () {
      const { arrayStorageSlot } = await loadFixture(deployOneYearLockFixture);
      const randomNum = Math.floor(Math.random() * 200 + 1);
      await (await arrayStorageSlot.setValue(randomNum)).wait();
      const someNumber = await arrayStorageSlot.someNumber();
      const someNumberArray = await arrayStorageSlot.getArray();
      await expect(someNumber).to.equal(randomNum);
      await expect(someNumberArray.length).to.equal(2);
      await expect(someNumberArray[0].toNumber()).to.equal(randomNum);
      await expect(someNumberArray[1].toNumber()).to.equal(randomNum + 1);
    });

    it("Checks from storage", async function () {
      const { arrayStorageSlot } = await loadFixture(deployOneYearLockFixture);
      const randomNum = Math.floor(Math.random() * 200 + 1);
      await (await arrayStorageSlot.setValue(randomNum)).wait();

      function getElementIndexByPosition(variablePosition: number, elementIndex: number): string {
        const startingIndex = ethers.utils.solidityKeccak256(["uint256"],[arrayPosition]);
        return BigNumber.from(startingIndex).add(elementIndex).toHexString();
      }

      const arrayPosition = 2;

      const firstIndex = getElementIndexByPosition(arrayPosition, 0);
      const elementOne = await ethers.provider.getStorageAt(arrayStorageSlot.address, firstIndex);
      await expect(BigNumber.from(elementOne).toNumber()).length.equal(randomNum);

      const secondIndex = getElementIndexByPosition(arrayPosition, 1);
      const elementTwo = await ethers.provider.getStorageAt(arrayStorageSlot.address, secondIndex);
      await expect(BigNumber.from(elementTwo).toNumber()).length.equal(randomNum + 1);

    });
  });

});
