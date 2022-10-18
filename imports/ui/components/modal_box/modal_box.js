import "./modal_box.html";

import { ReactiveDict } from "meteor/reactive-dict";

Template.ModalBox.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set("title", this.data.title);

});

Template.ModalBox.helpers({
    "id": function() {
        const t = Template.instance();
        return t.data.id || ""
    },
    "title": function() {
        const t = Template.instance();
        return t.state.get("title") || "";
    },
    "renderTemplate": function() {
        const t = Template.instance();
        return t.data.content;
    }
});