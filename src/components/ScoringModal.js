import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
  TreeSelect,
  Row,
  Typography,
  message,
  Upload,
  Flex,
  Segmented,
  theme,
  ConfigProvider,
  Modal,
  Image,
  Divider,
  Tag,
  Collapse,
} from 'antd';
import styled from 'styled-components';
import '../style/style.css'
import { CharacterStats } from '../lib/characterStats';
import { CharacterPreview } from './CharacterPreview';
import { Assets } from '../lib/assets';
import { HeaderText } from './HeaderText';

const { TextArea } = Input;
const { Text } = Typography;

const TitleDivider = styled(Divider)`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`
const InputNumberStyled = styled(InputNumber)`
  width: 62px
`
const PStyled = styled.p`
  margin: '7px 0px'
`

function generateOrnamentsOptions() {
  return Object.values(Constants.SetsOrnaments).map(x => {
    return {
      value: x,
      label:
        <Flex gap={5} align='center'>
          <img src={Assets.getSetImage(x, Constants.Parts.PlanarSphere)} style={{ width: 26, height: 26 }}></img>
          <div style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', width: 250, whiteSpace: 'nowrap' }}>
            {x}
          </div>
        </Flex>
    }
  })
}

function generateRelicsOptions() {
  return Object.values(Constants.SetsRelics).map(x => {
    return {
      value: x,
      label:
        <Flex gap={5} align='center'>
          <img src={Assets.getSetImage(x, Constants.Parts.Head)} style={{ width: 26, height: 26 }}></img>
          <div style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', width: 250, whiteSpace: 'nowrap' }}>
            {x}
          </div>
        </Flex>
    }
  })
}

function ornamentSetTagRenderer(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ display: 'flex', flexDirection: 'row', paddingInline: '1px', marginInlineEnd: '4px', height: 32, alignItems: 'center', overflow: 'hidden' }}
    >
      <Flex>
        <img title={value} src={Assets.getSetImage(value, Constants.Parts.PlanarSphere)} style={{ width: 40, height: 40 }}></img>
      </Flex>
    </Tag>
  );
}

function relicSetTagRenderer(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ display: 'flex', flexDirection: 'row', paddingInline: '1px', marginInlineEnd: '4px', height: 32, alignItems: 'center', overflow: 'hidden' }}
    >
      <Flex>
        <img title={value} src={Assets.getSetImage(value, Constants.Parts.PlanarSphere)} style={{ width: 40, height: 40 }}></img>
      </Flex>
    </Tag>
  );
}

export default function ScoringModal() {
  const [scoringAlgorithmForm] = Form.useForm();
  const [selectedScoringCharacter, setSelectedScoringCharacter] = useState();
  window.setSelectedScoringAlgorithmCharacter = function (character) {
    setSelectedScoringCharacter(character)
    if (character && character.id) {
      characterSelectorChange(character.id)
    }
  }

  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  window.setIsScoringModalOpen = setIsScoringModalOpen


  function characterSelectorChange(id) {
    setSelectedScoringCharacter(characterOptions.find(x => x.id == id))
    let character = DB.getCharacterById(id)
    if (character) {
      let defaultScores = JSON.parse(JSON.stringify(DB.getMetadata().characters[id].scores))
      defaultScores.characterId = id
      for (let x of Object.entries(defaultScores.stats)) {
        if (x[1] == 0) {
          defaultScores.stats[x[0]] = undefined
        }
      }
      scoringAlgorithmForm.setFieldsValue(defaultScores)

      console.log(defaultScores)
    }
  }

  const panelWidth = 225
  const defaultGap = 5
  const selectWidth = 360

  const characterOptions = useMemo(() => {
    let characterData = JSON.parse(JSON.stringify(DB.getMetadata().characters));

    for (let value of Object.values(characterData)) {
      value.value = value.id;
      value.label = value.displayName;
    }

    return Object.values(characterData).sort((a, b) => a.label.localeCompare(b.label))
  }, []);

  const showModal = () => {
    setIsScoringModalOpen(true);
  };
  const handleOk = () => {
    setIsScoringModalOpen(false);
  };
  const handleCancel = () => {
    setIsScoringModalOpen(false);
  };

  function StatValueRow(props) {
    return (
      <Flex justify="flex-start" style={{ width: panelWidth }} align='center' gap={5}>
        <Form.Item size="default" name={['stats', props.stat]}>
          <InputNumberStyled controls={false} size="small" />
        </Form.Item>
        <Flex>
          <img src={Assets.getStatIcon(props.stat)} style={{ width: 25, height: 25, marginRight: 3 }}></img>
          <Text style={{ lineHeight: 1.8 }}>{Constants.StatsToReadable[props.stat]}</Text>
        </Flex>
      </Flex>
    )
  }

  function onModalOk() {
    console.log('Modal OK');
    scoringAlgorithmForm.submit()
    setIsScoringModalOpen(false)

    // TODO ...
    setTimeout(() => forceRelicScorerTabUpdate(), 100)
    setTimeout(() => forceCharacterTabUpdate(), 100)
  }

  const onFinish = (x) => {
    console.log('Form finished', x);
    x.stats[Constants.Stats.ATK_P] = x.stats[Constants.Stats.ATK]
    x.stats[Constants.Stats.DEF_P] = x.stats[Constants.Stats.DEF]
    x.stats[Constants.Stats.HP_P] = x.stats[Constants.Stats.HP]

    x.modified = true
    DB.getMetadata().characters[selectedScoringCharacter.id].scores = x
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  let previewSrc = (selectedScoringCharacter && selectedScoringCharacter.id) ? Assets.getCharacterPreviewById(selectedScoringCharacter.id) : Assets.getBlank()
  
  let methodologyCollapse = (
    <Text>
      <PStyled>
        Substat scoring is calculated by <code>Score = weight * normalization * value</code>.
        The weight of each stat is defined above, on a scale of 0 to 1.
        The normalization of each stat is calculated based on the ratio of their main stat values to Crit DMG with max value <code>64.8</code>:
      </PStyled>
      <Flex justify='space-between' style={{ marginRight: 120 }}>
        <ul>
          <li><code>CD BE = 64.8 / 64.8 == 1.0</code></li>
          <li><code>DEF% = 64.8 / 54.0 == 1.2</code></li>
          <li><code>HP% ATK% EHR = 64.8 / 43.2 == 1.5</code></li>
          <li><code>CR = 64.8 / 32.4 == 2</code></li>
        </ul>
        <ul>
          <li><code>SPD = 64.8 / 25.032 == 2.59</code></li>
          <li><code>OHB = 64.8 / 34.561 == 1.87</code></li>
          <li><code>ERR = 64.8 / 19.439 == 3.33</code></li>
          <li><code>ELEMENTAL DMG = 64.8 / 38.88 == 1.67</code></li>
        </ul>
      </Flex>
      <PStyled style={{ margin: '7px 0px' }}>
        Flat ATK/HP/DEF have a separate calculation: <code>1 / (2 * character base * 0.01) * (64.8 / (% main stat value))</code>.
        This converts the flat stat value to a percent equivalent by base stats, then normalizes it.
        Double the character base is used instead of character + light cone base due to the variable nature of light cone stats.
      </PStyled>

      <PStyled style={{ margin: '7px 0px' }}>
        A letter grade is assigned based on the number of normalized min rolls of each substat.
        The score for each min roll in theory should be equivalent to <code>5.184</code>, but is rounded down to <code>5.1</code> due to the game not displaying extra decimals.
        The general scale for grade by rolls is <code>F=1, D=2, C=3, B=4, A=5, S=6, SS=7, SSS=8, WTF=9</code> with a <code>+</code> assigned for an additional half roll.
      </PStyled>

      <PStyled style={{ margin: '7px 0px' }}>
        Character scores are calculated by <code>Score = sum(relic substat scores) + sum(main stat scores)</code>.
        Only the head/body/sphere/rope relics have main stat scores.
        The main stat score for a 5 star maxed relic is <code>64.8</code> if the main stat is optimal, otherwise scaled down by the stat weight.
        Non 5 star relic scores are also scaled down by their maximum enhance. 
        Characters are expected to have 3 full sets, so 3 rolls worth of score is deducted for each missing set.
      </PStyled>

      <PStyled style={{ margin: '7px 0px' }}>
        Body/feet/sphere/rope relics are granted extra rolls to compensate for the difficulty of obtaining optimal main stats with desired substats.
        These numbers were calculated by a simulation of relic rolls accounting for main stat drop rate and expected substat value.
        These rolls are multiplied by the min roll value of <code>5.1</code> for the bonus score value.
      </PStyled>

      <Flex justify='space-between' style={{ marginRight: 30 }}>
        <ul>
          <li><code>Body HP_P 1.280</code></li>
          <li><code>Body ATK_P 1.278</code></li>
          <li><code>Body DEF_P 1.305</code></li>
          <li><code>Body CR 1.647</code></li>
          <li><code>Body CD 1.643</code></li>
        </ul>
        <ul>
          <li><code>Body OHB 1.713</code></li>
          <li><code>Body EHR 1.653</code></li>
          <li><code>Feet HP_P 1.045</code></li>
          <li><code>Feet ATK_P 1.000</code></li>
          <li><code>Feet DEF_P 1.002</code></li>
        </ul>
        <ul>
          <li><code>Feet SPD 1.573</code></li>
          <li><code>PlanarSphere HP_P 1.583</code></li>
          <li><code>PlanarSphere ATK_P 1.545</code></li>
          <li><code>PlanarSphere DEF_P 1.595</code></li>
          <li><code>PlanarSphere ELEM 1.747</code></li>
        </ul>
        <ul>
          <li><code>LinkRope HP_P 1.056</code></li>
          <li><code>LinkRope ATK_P 1.016</code></li>
          <li><code>LinkRope DEF_P 1.161</code></li>
          <li><code>LinkRope BE 1.417</code></li>
          <li><code>LinkRope ERR 2.000</code></li>
        </ul>
      </Flex>

      <PStyled style={{ margin: '7px 0px' }}>
        This scoring method is still experimental and subject to change, please come by the discord server to share any feedback!
      </PStyled>
    </Text>
  )

  return (
    <Modal
      open={isScoringModalOpen}
      width={900}
      destroyOnClose
      centered
      onOk={onModalOk}
      onCancel={handleCancel}
    >
      <Form
        form={scoringAlgorithmForm}
        preserve={false}
        layout="vertical"
        onFinish={onFinish}
      >

        <TitleDivider>Stat weights</TitleDivider>

        <Flex gap={10} vertical>
          <Flex gap={20} justify='space-between'>
            <Flex vertical gap={5}>
              <Form.Item size="default" name='characterId'>
                <Select
                  showSearch
                  filterOption={filterOption}
                  style={{ width: panelWidth }}
                  onChange={characterSelectorChange}
                  options={characterOptions}
                />
              </Form.Item>
              <div style={{ height: 230, width: panelWidth, overflow: 'hidden' }}>
                <img src={previewSrc} style={{ width: panelWidth }} />
              </div>
            </Flex>
            <Flex vertical gap={3}>
              <StatValueRow stat={Constants.Stats.ATK} />
              <StatValueRow stat={Constants.Stats.HP} />
              <StatValueRow stat={Constants.Stats.DEF} />
              <StatValueRow stat={Constants.Stats.SPD} />
              <StatValueRow stat={Constants.Stats.CR} />
              <StatValueRow stat={Constants.Stats.CD} />
              <StatValueRow stat={Constants.Stats.EHR} />
              <StatValueRow stat={Constants.Stats.RES} />
              <StatValueRow stat={Constants.Stats.BE} />
            </Flex>
            <Flex vertical gap={3}>
              <StatValueRow stat={Constants.Stats.ERR} />
              <StatValueRow stat={Constants.Stats.OHB} />
              <StatValueRow stat={Constants.Stats.Physical_DMG} />
              <StatValueRow stat={Constants.Stats.Fire_DMG} />
              <StatValueRow stat={Constants.Stats.Ice_DMG} />
              <StatValueRow stat={Constants.Stats.Lightning_DMG} />
              <StatValueRow stat={Constants.Stats.Wind_DMG} />
              <StatValueRow stat={Constants.Stats.Quantum_DMG} />
              <StatValueRow stat={Constants.Stats.Imaginary_DMG} />
            </Flex>
          </Flex>
        </Flex>

        <TitleDivider>Optimal main stats</TitleDivider>

        <Flex justify='space-between'>
          <Flex vertical gap={defaultGap * 2}>
            <Flex vertical gap={1} justify='flex-start'>
              <Text style={{ marginLeft: 5 }}>
                Body
              </Text>
              <Form.Item size="default" name={['parts', Constants.Parts.Body]}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: selectWidth,
                  }}
                  placeholder="Body"
                  maxTagCount='responsive'>
                  <Select.Option value={Constants.Stats.HP_P}>HP%</Select.Option>
                  <Select.Option value={Constants.Stats.ATK_P}>ATK%</Select.Option>
                  <Select.Option value={Constants.Stats.DEF_P}>DEF%</Select.Option>
                  <Select.Option value={Constants.Stats.CR}>CRIT Rate</Select.Option>
                  <Select.Option value={Constants.Stats.CD}>CRIT DMG</Select.Option>
                  <Select.Option value={Constants.Stats.OHB}>Outgoing Healing</Select.Option>
                  <Select.Option value={Constants.Stats.EHR}>Effect HIT Rate</Select.Option>
                </Select>
              </Form.Item>
            </Flex>

            <Flex vertical gap={1} justify='flex-start'>
              <Text style={{ marginLeft: 5 }}>
                Feet
              </Text>
              <Form.Item size="default" name={['parts', Constants.Parts.Feet]}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: selectWidth,
                  }}
                  placeholder="Feet"
                  maxTagCount='responsive'>
                  <Select.Option value={Constants.Stats.HP_P}>HP%</Select.Option>
                  <Select.Option value={Constants.Stats.ATK_P}>ATK%</Select.Option>
                  <Select.Option value={Constants.Stats.DEF_P}>DEF%</Select.Option>
                  <Select.Option value={Constants.Stats.SPD}>Speed</Select.Option>
                </Select>
              </Form.Item>
            </Flex>
          </Flex>
          <Flex vertical gap={defaultGap * 2}>
            <Flex vertical gap={1} justify='flex-start'>
              <Text style={{ marginLeft: 5 }}>
                Planar Sphere
              </Text>
              <Form.Item size="default" name={['parts', Constants.Parts.PlanarSphere]}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: selectWidth,
                  }}
                  placeholder="Planar Sphere"
                  listHeight={400}
                  maxTagCount='responsive'>
                  <Select.Option value={Constants.Stats.HP_P}>HP%</Select.Option>
                  <Select.Option value={Constants.Stats.ATK_P}>ATK%</Select.Option>
                  <Select.Option value={Constants.Stats.DEF_P}>DEF%</Select.Option>
                  <Select.Option value={Constants.Stats.Physical_DMG}>Physical DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Fire_DMG}>Fire DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Ice_DMG}>Ice DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Lightning_DMG}>Lightning DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Wind_DMG}>Wind DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Quantum_DMG}>Quantum DMG</Select.Option>
                  <Select.Option value={Constants.Stats.Imaginary_DMG}>Imaginary DMG</Select.Option>
                </Select>
              </Form.Item>
            </Flex>

            <Flex vertical gap={1} justify='flex-start'>
              <Text style={{ marginLeft: 5 }}>
                Link rope
              </Text>

              <Form.Item size="default" name={['parts', Constants.Parts.LinkRope]}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: selectWidth,
                  }}
                  placeholder="Link Rope"
                  maxTagCount='responsive'>
                  <Select.Option value={Constants.Stats.HP_P}>HP%</Select.Option>
                  <Select.Option value={Constants.Stats.ATK_P}>ATK%</Select.Option>
                  <Select.Option value={Constants.Stats.DEF_P}>DEF%</Select.Option>
                  <Select.Option value={Constants.Stats.BE}>Break Effect</Select.Option>
                  <Select.Option value={Constants.Stats.ERR}>Energy Regeneration Rate</Select.Option>
                </Select>
              </Form.Item>
            </Flex>
          </Flex>
        </Flex>

        <TitleDivider>Methodology</TitleDivider>

        <Collapse ghost items={[{
          key: '1',
          label: 'Click to show details',
          children: methodologyCollapse
        }]}>
        </Collapse>
{/* 
        <Divider />

        <Flex justify='space-between' align='center'>

          <Flex vertical gap={1} justify='flex-start'>
            <Text style={{ marginLeft: 5 }}>
              Relic sets
            </Text>
            <Form.Item size="default" name='relicSets'>
              <Select
                dropdownStyle={{
                  width: 250
                }}
                size={"large"}
                listHeight={800}
                mode="multiple"
                allowClear
                style={{
                  width: selectWidth
                }}
                options={generateRelicsOptions()}
                tagRender={relicSetTagRenderer}
                placeholder="Relic Sets"
                maxTagCount='responsive'>
              </Select>
            </Form.Item>
          </Flex>


          <Flex vertical gap={1} justify='flex-start'>
            <Text style={{ marginLeft: 5 }}>
              Planar Ornaments
            </Text>
            <Form.Item size="default" name='ornamentSets'>
              <Select
                dropdownStyle={{
                  width: 250
                }}
                size={"large"}
                listHeight={500}
                mode="multiple"
                allowClear
                style={{
                  width: selectWidth
                }}
                options={generateOrnamentsOptions()}
                tagRender={ornamentSetTagRenderer}
                placeholder="Planar Ornaments"
                maxTagCount='responsive'>
              </Select>
            </Form.Item>
          </Flex>
        </Flex> */}
      </Form>
    </Modal>
  );
};


// footer={[
//   <Button form={scoringAlgorithmForm} key="submit" htmlType="submit">
//       Submit
//   </Button>
// ]}