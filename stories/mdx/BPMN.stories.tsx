import { BPMN } from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof BPMN> = {
  title: 'Visualisation/BPMN',
  component: BPMN,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BPMN>;

export const Primary: Story = {
  args: {
    xml: (
`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_00nqh2i" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="12.0.0">
  <bpmn:collaboration id="Collaboration_07nogx7">
    <bpmn:participant id="Participant_094g53j" name="Swimlane 1" processRef="Process_177uzc6" />
  </bpmn:collaboration>
  <bpmn:process id="Process_177uzc6" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1k9sci9" name="Start">
      <bpmn:outgoing>Flow_1t61pc1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="Gateway_0ru9h3e" name="what to do?">
      <bpmn:incoming>Flow_1t61pc1</bpmn:incoming>
      <bpmn:outgoing>Flow_1nfntg8</bpmn:outgoing>
      <bpmn:outgoing>Flow_0vxo3d7</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_17f1r21" name="Do something">
      <bpmn:incoming>Flow_1nfntg8</bpmn:incoming>
      <bpmn:outgoing>Flow_0zvww4h</bpmn:outgoing>
    </bpmn:task>
    <bpmn:intermediateThrowEvent id="Event_0891vlj">
      <bpmn:incoming>Flow_0zvww4h</bpmn:incoming>
    </bpmn:intermediateThrowEvent>
    <bpmn:task id="Activity_0rdp6mt" name="Do something else">
      <bpmn:incoming>Flow_0vxo3d7</bpmn:incoming>
      <bpmn:outgoing>Flow_1wx51cq</bpmn:outgoing>
    </bpmn:task>
    <bpmn:intermediateThrowEvent id="Event_05khhnm">
      <bpmn:incoming>Flow_1wx51cq</bpmn:incoming>
    </bpmn:intermediateThrowEvent>
    <bpmn:sequenceFlow id="Flow_1t61pc1" sourceRef="StartEvent_1k9sci9" targetRef="Gateway_0ru9h3e" />
    <bpmn:sequenceFlow id="Flow_1nfntg8" sourceRef="Gateway_0ru9h3e" targetRef="Activity_17f1r21" />
    <bpmn:sequenceFlow id="Flow_0vxo3d7" sourceRef="Gateway_0ru9h3e" targetRef="Activity_0rdp6mt" />
    <bpmn:sequenceFlow id="Flow_0zvww4h" sourceRef="Activity_17f1r21" targetRef="Event_0891vlj" />
    <bpmn:sequenceFlow id="Flow_1wx51cq" sourceRef="Activity_0rdp6mt" targetRef="Event_05khhnm" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_07nogx7">
      <bpmndi:BPMNShape id="Participant_094g53j_di" bpmnElement="Participant_094g53j" isHorizontal="true">
        <dc:Bounds x="156" y="62" width="600" height="250" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1k9sci9">
        <dc:Bounds x="206" y="122" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="212" y="165" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0ru9h3e_di" bpmnElement="Gateway_0ru9h3e" isMarkerVisible="true">
        <dc:Bounds x="295" y="115" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="292" y="85" width="57" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_17f1r21_di" bpmnElement="Activity_17f1r21">
        <dc:Bounds x="400" y="100" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0891vlj_di" bpmnElement="Event_0891vlj">
        <dc:Bounds x="562" y="122" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0rdp6mt_di" bpmnElement="Activity_0rdp6mt">
        <dc:Bounds x="400" y="210" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_05khhnm_di" bpmnElement="Event_05khhnm">
        <dc:Bounds x="562" y="232" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1t61pc1_di" bpmnElement="Flow_1t61pc1">
        <di:waypoint x="242" y="140" />
        <di:waypoint x="295" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1nfntg8_di" bpmnElement="Flow_1nfntg8">
        <di:waypoint x="345" y="140" />
        <di:waypoint x="400" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0zvww4h_di" bpmnElement="Flow_0zvww4h">
        <di:waypoint x="500" y="140" />
        <di:waypoint x="562" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0vxo3d7_di" bpmnElement="Flow_0vxo3d7">
        <di:waypoint x="320" y="165" />
        <di:waypoint x="320" y="250" />
        <di:waypoint x="400" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1wx51cq_di" bpmnElement="Flow_1wx51cq">
        <di:waypoint x="500" y="250" />
        <di:waypoint x="562" y="250" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
    ),
    }
  };

  export const Empty: Story = {
    args: {
  
      }
    };





    export const Complex: Story = {
      args: {
        xml: (
    `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:color="http://www.omg.org/spec/BPMN/non-normative/color/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1997w8h" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="12.0.0">
  <bpmn:collaboration id="Collaboration_1nq380b">
    <bpmn:participant id="Participant_1tx4v33" name="Application Ingress" processRef="Process_022efzm" />
    <bpmn:participant id="Participant_0afdf1e" name="Application Egress" processRef="Process_18qp2wi" />
  </bpmn:collaboration>
  <bpmn:process id="Process_022efzm" isExecutable="false">
    <bpmn:startEvent id="StartEvent_05c2fnu">
      <bpmn:outgoing>Flow_1ybvi9n</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="Gateway_03cnysl" name="Needs to be accessed from a WAN">
      <bpmn:incoming>Flow_1ybvi9n</bpmn:incoming>
      <bpmn:outgoing>Flow_0tdo5fw</bpmn:outgoing>
      <bpmn:outgoing>Flow_0j7jthj</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_10tmx7h" name="Network Peering">
      <bpmn:incoming>Flow_15ezixd</bpmn:incoming>
    </bpmn:task>
    <bpmn:task id="Activity_07qz92k" name="PrivateLink">
      <bpmn:incoming>Flow_0hvlcrc</bpmn:incoming>
      <bpmn:incoming>Flow_0vc8cwj</bpmn:incoming>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_1ys6e3s" name="Supports D-NAT">
      <bpmn:incoming>Flow_0tdo5fw</bpmn:incoming>
      <bpmn:outgoing>Flow_15ezixd</bpmn:outgoing>
      <bpmn:outgoing>Flow_0hvlcrc</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:exclusiveGateway id="Gateway_1d58fai" name="Needs to be accessed from another Cloud app">
      <bpmn:incoming>Flow_0j7jthj</bpmn:incoming>
      <bpmn:outgoing>Flow_0vc8cwj</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_1ybvi9n" sourceRef="StartEvent_05c2fnu" targetRef="Gateway_03cnysl" />
    <bpmn:sequenceFlow id="Flow_0tdo5fw" name="Yes" sourceRef="Gateway_03cnysl" targetRef="Gateway_1ys6e3s" />
    <bpmn:sequenceFlow id="Flow_0j7jthj" sourceRef="Gateway_03cnysl" targetRef="Gateway_1d58fai" />
    <bpmn:sequenceFlow id="Flow_15ezixd" name="No" sourceRef="Gateway_1ys6e3s" targetRef="Activity_10tmx7h" />
    <bpmn:sequenceFlow id="Flow_0hvlcrc" name="yes" sourceRef="Gateway_1ys6e3s" targetRef="Activity_07qz92k" />
    <bpmn:sequenceFlow id="Flow_0vc8cwj" sourceRef="Gateway_1d58fai" targetRef="Activity_07qz92k" />
  </bpmn:process>
  <bpmn:process id="Process_18qp2wi">
    <bpmn:startEvent id="Event_1ko5zjf">
      <bpmn:outgoing>Flow_1i0e5hi</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="Gateway_0av6ksz" name="Known Endpoints (4-tuple)">
      <bpmn:incoming>Flow_1i0e5hi</bpmn:incoming>
      <bpmn:outgoing>Flow_18ew69m</bpmn:outgoing>
      <bpmn:outgoing>Flow_0guxstw</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_0cjdjxk" name="Security Groups">
      <bpmn:incoming>Flow_18ew69m</bpmn:incoming>
    </bpmn:task>
    <bpmn:task id="Activity_11j8gnq" name="Sidecar Proxy Pattern">
      <bpmn:incoming>Flow_0oytv0r</bpmn:incoming>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_0rhoxmm" name="Known URLs">
      <bpmn:incoming>Flow_0guxstw</bpmn:incoming>
      <bpmn:outgoing>Flow_0r80tov</bpmn:outgoing>
      <bpmn:outgoing>Flow_0y9b8vt</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:endEvent id="Event_1iv012g" name="Not Zero-Trust!">
      <bpmn:incoming>Flow_0y9b8vt</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:exclusiveGateway id="Gateway_0i1vrcm" name="Supports Proxy">
      <bpmn:incoming>Flow_0r80tov</bpmn:incoming>
      <bpmn:outgoing>Flow_0oytv0r</bpmn:outgoing>
      <bpmn:outgoing>Flow_1a1ybby</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_0n1ir69" name="Inline L7 Firewall / Proxy">
      <bpmn:incoming>Flow_1a1ybby</bpmn:incoming>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1i0e5hi" sourceRef="Event_1ko5zjf" targetRef="Gateway_0av6ksz" />
    <bpmn:sequenceFlow id="Flow_18ew69m" name="Yes" sourceRef="Gateway_0av6ksz" targetRef="Activity_0cjdjxk" />
    <bpmn:sequenceFlow id="Flow_0guxstw" name="No" sourceRef="Gateway_0av6ksz" targetRef="Gateway_0rhoxmm" />
    <bpmn:sequenceFlow id="Flow_0oytv0r" name="Yes" sourceRef="Gateway_0i1vrcm" targetRef="Activity_11j8gnq" />
    <bpmn:sequenceFlow id="Flow_0r80tov" sourceRef="Gateway_0rhoxmm" targetRef="Gateway_0i1vrcm" />
    <bpmn:sequenceFlow id="Flow_0y9b8vt" name="No" sourceRef="Gateway_0rhoxmm" targetRef="Event_1iv012g" />
    <bpmn:sequenceFlow id="Flow_1a1ybby" name="No" sourceRef="Gateway_0i1vrcm" targetRef="Activity_0n1ir69" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1nq380b">
      <bpmndi:BPMNShape id="Participant_1tx4v33_di" bpmnElement="Participant_1tx4v33" isHorizontal="true">
        <dc:Bounds x="156" y="80" width="904" height="285" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_05c2fnu">
        <dc:Bounds x="206" y="142" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1ske0jv_di" bpmnElement="Gateway_03cnysl" isMarkerVisible="true">
        <dc:Bounds x="295" y="135" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="279" y="85" width="81" height="40" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_10tmx7h_di" bpmnElement="Activity_10tmx7h" bioc:stroke="#831311" bioc:fill="#ffcdd2" color:background-color="#ffcdd2" color:border-color="#831311">
        <dc:Bounds x="880" y="120" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_07qz92k_di" bpmnElement="Activity_07qz92k" bioc:stroke="#205022" bioc:fill="#c8e6c9" color:background-color="#c8e6c9" color:border-color="#205022">
        <dc:Bounds x="880" y="230" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1ys6e3s_di" bpmnElement="Gateway_1ys6e3s" isMarkerVisible="true">
        <dc:Bounds x="615" y="135" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="599" y="111" width="81" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1d58fai_di" bpmnElement="Gateway_1d58fai" isMarkerVisible="true">
        <dc:Bounds x="465" y="245" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="454" y="302" width="72" height="53" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1ybvi9n_di" bpmnElement="Flow_1ybvi9n">
        <di:waypoint x="242" y="160" />
        <di:waypoint x="295" y="160" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0tdo5fw_di" bpmnElement="Flow_0tdo5fw">
        <di:waypoint x="345" y="160" />
        <di:waypoint x="615" y="160" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="473" y="142" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_15ezixd_di" bpmnElement="Flow_15ezixd">
        <di:waypoint x="665" y="160" />
        <di:waypoint x="880" y="160" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="765" y="142" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0hvlcrc_di" bpmnElement="Flow_0hvlcrc">
        <di:waypoint x="640" y="185" />
        <di:waypoint x="640" y="270" />
        <di:waypoint x="880" y="270" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="646" y="225" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0j7jthj_di" bpmnElement="Flow_0j7jthj">
        <di:waypoint x="320" y="185" />
        <di:waypoint x="320" y="270" />
        <di:waypoint x="465" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0vc8cwj_di" bpmnElement="Flow_0vc8cwj">
        <di:waypoint x="515" y="270" />
        <di:waypoint x="880" y="270" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Participant_0afdf1e_di" bpmnElement="Participant_0afdf1e" isHorizontal="true">
        <dc:Bounds x="156" y="380" width="904" height="368" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1ko5zjf_di" bpmnElement="Event_1ko5zjf">
        <dc:Bounds x="232" y="432" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0av6ksz_di" bpmnElement="Gateway_0av6ksz" isMarkerVisible="true">
        <dc:Bounds x="325" y="425" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="307" y="401" width="86" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0cjdjxk_di" bpmnElement="Activity_0cjdjxk" bioc:stroke="#205022" bioc:fill="#c8e6c9" color:background-color="#c8e6c9" color:border-color="#205022">
        <dc:Bounds x="510" y="410" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_11j8gnq_di" bpmnElement="Activity_11j8gnq" bioc:stroke="#205022" bioc:fill="#c8e6c9" color:background-color="#c8e6c9" color:border-color="#205022">
        <dc:Bounds x="750" y="520" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0rhoxmm_di" bpmnElement="Gateway_0rhoxmm" isMarkerVisible="true">
        <dc:Bounds x="415" y="535" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="407" y="511" width="65" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1iv012g_di" bpmnElement="Event_1iv012g" bioc:stroke="#831311" bioc:fill="#ffcdd2" color:background-color="#ffcdd2" color:border-color="#831311">
        <dc:Bounds x="232" y="622" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="213" y="665" width="75" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0i1vrcm_di" bpmnElement="Gateway_0i1vrcm" isMarkerVisible="true">
        <dc:Bounds x="555" y="535" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="542" y="511" width="76" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0n1ir69_di" bpmnElement="Activity_0n1ir69" bioc:stroke="#831311" bioc:fill="#ffcdd2" color:background-color="#ffcdd2" color:border-color="#831311">
        <dc:Bounds x="750" y="630" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1i0e5hi_di" bpmnElement="Flow_1i0e5hi">
        <di:waypoint x="268" y="450" />
        <di:waypoint x="325" y="450" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_18ew69m_di" bpmnElement="Flow_18ew69m">
        <di:waypoint x="375" y="450" />
        <di:waypoint x="510" y="450" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="433" y="432" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0guxstw_di" bpmnElement="Flow_0guxstw">
        <di:waypoint x="350" y="475" />
        <di:waypoint x="350" y="560" />
        <di:waypoint x="415" y="560" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="358" y="515" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0oytv0r_di" bpmnElement="Flow_0oytv0r">
        <di:waypoint x="605" y="560" />
        <di:waypoint x="750" y="560" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="668" y="542" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0r80tov_di" bpmnElement="Flow_0r80tov">
        <di:waypoint x="465" y="560" />
        <di:waypoint x="555" y="560" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0y9b8vt_di" bpmnElement="Flow_0y9b8vt">
        <di:waypoint x="440" y="585" />
        <di:waypoint x="440" y="640" />
        <di:waypoint x="268" y="640" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="448" y="610" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1a1ybby_di" bpmnElement="Flow_1a1ybby">
        <di:waypoint x="580" y="585" />
        <di:waypoint x="580" y="670" />
        <di:waypoint x="750" y="670" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="588" y="625" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
    ),
    }
  };
  
