import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, BytesLike } from 'ethers';

describe("IndexedLogs", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const IndexedLogs = await ethers.getContractFactory("IndexedLogs");
    const indexedLogs = await IndexedLogs.deploy();

    return { indexedLogs, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { indexedLogs, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await indexedLogs.owner()).to.equal(owner.address);
    });

  });

  describe("Run logs", function () {

    it("Checks non indexed logs", async function () {
      const { indexedLogs, owner } = await loadFixture(deployOneYearLockFixture);
      const randomNum = Math.floor(Math.random() * 200 + 1);

      const result = await (await indexedLogs.doAction(randomNum)).wait();

      await expect(result.events).is.not.empty;
      const event = result.events?.find((e: { event: string; }) => e.event === 'NonIndexedAction');
      await expect(event).is.not.empty;
      await expect(event!.args).is.not.empty;
      const { caller, actionNum } = event!.args as unknown as { caller: string, actionNum: BigNumber };
      expect(actionNum.toNumber()).to.equal(randomNum);
      expect(caller).to.equal(owner.address);

    });

    it("Checks indexed logs", async function () {
      const { indexedLogs, owner } = await loadFixture(deployOneYearLockFixture);
      const randomNum = Math.floor(Math.random() * 200 + 1);

      const result = await (await indexedLogs.doAction(randomNum)).wait();

      await expect(result.events).is.not.empty;
      const event = result.events?.find((e: { event: string; }) => e.event === 'IndexedAction');
      console.log('messageEvent', event);
      await expect(event).is.not.empty;
      await expect(event!.args).is.not.empty;
      const { caller, actionNum } = event!.args as unknown as { caller: string, actionNum: BigNumber };
      expect(actionNum.toNumber()).to.equal(randomNum);
      expect(caller).to.equal(owner.address);

      indexedLogs.on

    });
  });

});
