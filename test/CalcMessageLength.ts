import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, BytesLike } from 'ethers';
import { randomHashBuffer, randomHash } from 'hardhat/internal/hardhat-network/provider/utils/random';

describe("CalcMessageLength", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const CalcMessageLength = await ethers.getContractFactory("CalcMessageLength");
    const calcMessageLength = await CalcMessageLength.deploy();

    return { calcMessageLength, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { calcMessageLength, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await calcMessageLength.owner()).to.equal(owner.address);
    });

  });

  describe("Do Action", function () {
    it("emits event with passed data", async function () {
      const { calcMessageLength } = await loadFixture(deployOneYearLockFixture);

      const bytes = randomHash();
      const num = Math.floor(Math.random() * 1000);

      const result = await (await calcMessageLength.doAction(
        bytes,
        num,
      )).wait();

      await expect(result.events).is.not.empty;
      const messageEvent = result.events?.find(e => e.event === 'Action');
      await expect(messageEvent).is.not.empty;
      await expect(messageEvent!.args).is.not.empty;
      const { message, actionNum } = messageEvent!.args as unknown as { message: BytesLike, actionNum: BigNumber };
      await expect(message.toString()).is.equal(bytes);
      await expect(actionNum.toNumber()).is.equal(num);

    });

    it("emits event with message length", async function () {
      const { calcMessageLength } = await loadFixture(deployOneYearLockFixture);

      const buffersCount = Math.floor(Math.random() * 50 + 1);
      const buffers = new Array(buffersCount).fill(null).map(() => {
        return randomHashBuffer().slice(0, Math.floor(Math.random() * 32 + 1));
      });
      const bytes = Buffer.concat(buffers);
      const num = Math.floor(Math.random() * 1000);

      const result = await (await calcMessageLength.doAction(
        bytes,
        num,
      )).wait();
      
      const messagePieces = Math.ceil(bytes.length / 32);

      const calldatalen = 4 + // function selector;
        messagePieces * 32 + // message bytes per 32
        32 + // uint256 actionNum;
        32 + // arg name 1 message
        32 // arg name 2 actionNum;


      await expect(result.events).is.not.empty;
      const lengthEvent = result.events?.find(e => e.event === 'CalldataLength');
      await expect(lengthEvent).is.not.empty;
      const { actionNum, calldataLength } = lengthEvent!.args as unknown as { actionNum: BigNumber, calldataLength: BigNumber };
      await expect(actionNum.toNumber()).is.equal(num);
      await expect(calldataLength.toNumber()).is.equal(calldatalen);

    });

  });


});
