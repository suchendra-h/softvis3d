import {assert, expect} from "chai";
import * as Sinon from "sinon";
import Event from "../../../../src/components/scene/events/Event";
import {SceneMouseInteractions} from "../../../../src/components/scene/events/SceneMouseInteractions";
import {HtmlDomService} from "../../../../src/services/HtmlDomService";
import {createMock} from "../../../Helper";

describe("SceneMouseInteractions", () => {

    it("should add and remove event listeners on object create or destruct.", () => {
        const windowStubAdd = Sinon.stub(window, "addEventListener");
        const windowStubRemove = Sinon.stub(window, "removeEventListener");

        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        assert(windowStubAdd.calledOnce);
        assert(windowStubAdd.calledWith("mousedown"));

        underTest.destroy();

        assert(windowStubRemove.calledOnce);
        assert(windowStubRemove.calledWith("mousedown"));

        windowStubAdd.restore();
        windowStubRemove.restore();
    });

    it("should raise mouse down event on click on descendant.", () => {
        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const eventClickScene = {target: null} as any as MouseEvent;

        const listener: (result: Event<boolean>) => void = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.true;
        };
        const spy = Sinon.spy(listener);

        underTest.addMouseDownEventListener(spy);

        const htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.isDescendant.returns(true);

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);
    });

    it("should raise mouse down event on click on descendant.", () => {
        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const listener: (result: Event<boolean>) => void = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.true;
        };
        const spy = Sinon.spy(listener);

        underTest.addMouseDownEventListener(spy);

        const htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.isDescendant.returns(false);

        const documentMock = {} as any as Document;
        const documentStub = Sinon.stub(document, "getElementById");
        documentStub.returns(documentMock);

        const eventClickScene = {target: documentMock} as any as MouseEvent;

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);
    });

    it("should raise mouse down event with false on click if not in scene.", () => {
        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const listener: (result: Event<boolean>) => void = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.false;
        };
        const spy = Sinon.spy(listener);

        const htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.isDescendant.returns(false);

        underTest.addMouseDownEventListener(spy);
        const eventClickScene = {target: ""} as any as MouseEvent;

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);
    });

    it("should raise mouse moved event on mouse up and not moved.", () => {
        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const listener1: () => void = () => undefined;
        const spy1 = Sinon.spy(listener1);
        const listener2: () => void = () => undefined;
        const spy2 = Sinon.spy(listener2);

        underTest.addMouseMovedEventListener(spy1);
        underTest.addSelectObjectEventEventListener(spy2);
        const event = {target: ""} as any as MouseEvent;

        underTest.setMouseMoved(true);
        underTest.onMouseUp(event);

        assert(spy1.calledOnce);
        assert(spy2.notCalled);
    });

    it("should raise select object event on mouse up and moved.", () => {
        const underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const listener1: () => void = () => undefined;
        const spy1 = Sinon.spy(listener1);
        const listener2: () => void = () => undefined;
        const spy2 = Sinon.spy(listener2);

        underTest.addMouseMovedEventListener(spy1);
        underTest.addSelectObjectEventEventListener(spy2);
        const event = {target: ""} as any as MouseEvent;

        underTest.setMouseMoved(false);
        underTest.onMouseUp(event);

        assert(spy1.calledOnce);
        assert(spy2.calledOnce);
    });

});